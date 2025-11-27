## Data Pipeline

### Standardize rasters to common grid (Colab)

High-level: reproject/warp raster and shapefiles to same CRS/resolution with `rasterio` / `rioxarray`.

```
import rioxarray as rxr
import xarray as xr

# open netCDF or GeoTIFF
ds = rxr.open_rasterio("ice_day0.tif", masked=True).squeeze()
# reproject to target_crs and resample to target resolution
target_crs = "EPSG:4326"
ds2 = ds.rio.reproject(target_crs, resolution=(0.01, 0.01))  # choose resolution
```

Make a timeseries stack (xarray DataArray):

```
# stack daily rasters to one DataArray: ice[t, lat, lon]
ice_stack = xr.concat([ds_day0, ds_day1, ..., ds_dayN], dim="time")
```

### Derive fields

- binary presence: `ice_stack > threshold`
- concentration: if values already in [0,1] use them; else normalize backscatter to proxy concentration.
- motion: estimate daily displacement by cross-correlation or simple centroid tracking in tiles (or compute drift from wind).

Quick motion via wind (approx):

```
# simple drift: displacement_km = alpha * wind_speed_kmh  # alpha calibrates response
# convert displacement to degrees lat/lon approx: dx = displacement_km / (111 km)
```

### Heuristic forecasting algorithm (ready-to-run pseudo)

Algorithm summary:

- Given `ice_t` (concentration), `temp_forecast`, `wind_forecast`:
    - Melt/growth: `delta_conc_temp = f(temp)` where f is piecewise linear:
        - temp < -5°C: +0.05 per day (grow)
        - -5°C ≤ temp ≤ 0°C: 0
        - temp > 0°C: -0.1 per day (melt)
    - Apply morphological dilation/erosion to spread/fade edges
    - Drift: shift raster by dx/dy (computed from wind speed/direction and alpha)
    - Clamp concentration to [0,1]
    - Repeat for t+1, t+2, t+3

Python skeleton:

```
import numpy as np
from scipy.ndimage import binary_dilation, binary_erosion, shift

def temp_delta(temp_c):
    if temp_c < -5: return 0.05
    if temp_c > 0: return -0.1
    return 0.0

def forecast_step(conc, temp, wind_speed, wind_dir, alpha=0.02):
    # 1) temp-driven change
    delta = temp_delta(temp)
    conc = conc + delta
    # 2) morphological effect for growth/melt
    if delta > 0:
        conc = np.maximum(conc, binary_dilation(conc>0.1).astype(float)*0.2)
    else:
        conc = conc * 0.9  # erosion-style decrease
    # 3) drift: compute pixel shift from wind
    # convert wind_dir (deg) and wind_speed (m/s) to pixel shift
    dx = alpha * wind_speed * np.cos(np.deg2rad(wind_dir))
    dy = alpha * wind_speed * np.sin(np.deg2rad(wind_dir))
    conc = shift(conc, shift=(dy, dx), order=1, mode='nearest')
    # clamp
    conc = np.clip(conc, 0, 1)
    return conc
```

Run for 3 days iteratively using day-specific temp/wind forecasts.

### Linear regression refinement (optional, fast)

Train a simple pixelwise/regional regression that maps last day conc + temp + wind → next-day conc. Train on your 3-week history (sliding windows).

Simplified:

```
from sklearn.linear_model import Ridge
X = np.stack([conc_t_flat, temp_t_flat, wind_speed_t_flat, wind_dir_sin, wind_dir_cos], axis=1)
y = conc_tplus1_flat
model = Ridge(alpha=1.0).fit(X, y)
```

Use model to predict next days recursively.

### Quick U-Net / ConvLSTM note (stretch)

Downsample grids to 128×128 tiles.

Input: last 3 daily ice rasters + daily temp + wind channels → predict next day ice map.

Use lightweight U-Net or ConvLSTM in TensorFlow (train for a few epochs). Only attempt if comfortable and have GPU in Colab.

## Visualization & frontend

- For quick demo: Streamlit is fastest to get interactive map + narrative in Colab/hosted. Use `folium` or `leaflet` tiles.
- For polish: React + Leaflet + GeoJSON overlays. Export rasters as XYZ / tiles or as PNG overlays.

Rendering maps:
- Use `matplotlib` to produce JPGs for each forecast day (colormap for concentration, shipping lanes overlaid with `geopandas`).
- Use `imageio` to create GIF of day0→day3.

Example Matplotlib export:

```
import matplotlib.pyplot as plt
plt.imshow(conc, origin='lower', vmin=0, vmax=1)
plt.colorbar(label='Ice concentration')
# overlay shipping lanes (lon/lat) using plt.plot after converting coords
plt.savefig("forecast_day1.jpg", dpi=200)
```

Frontend features:

- Slider for day selection (0–3)
- Toggle for overlays: shipping lanes, drift arrows, fast vs pack mask
- Narrative side-panel summarizing confidence & recommended USCG actions (e.g., where to stage assets)

## Short report

Structure:

1. Objective & data sources (list SAR products, netCDF, shapefiles, weather forecasts, shipping lanes)

2. Preprocessing (reprojection, grid resolution, derived variables)

3. Model(s) — clearly describe the heuristic rules, regression, or ML model and why chosen. Provide equations (e.g., linear regression used: `Ice_{t+1} = a Ice_t + b Temp_t + c WindSpeed_t + ...`)

4. Forecast maps — show day0..day3 images and give a 2–3 sentence interpretation for each day (spatial extents, shipping-lane impacts).

5. Uncertainty & limitations — explain what you could not do (ice thickness accuracy, SAR cadence) and how to improve (more SAR, altimetry, in-situ thickness).

6. Operational suggestions — e.g., recommended staging locations, suggested frequency for reforecast, where to task icebreakers first.

7. Appendix — code summary, runtime, data sources, and parameter choices.

Write the narrative as markdown in the repo and also render as a small page in the frontend.

## Quick evaluation metrics

- MAE of predicted concentration vs true after 1 day (on held-out days from your 3-week period).
- Binary accuracy for ice/no-ice at threshold 0.15.
- Precision/Recall for predicting presence in shipping lanes.

Compute and report these on your historical period (backtesting) so judges can see quantitative gains.

## Deliverable checklist

`forecast_day0.jpg … forecast_day3.jpg` (and GIF)

`index.html` or Streamlit app to demo forecasts + narrative

`report.pdf` (1–2 pages) + README with instructions to run

`code/colab_notebook.ipynb` with preprocessing + model code

small slide (2–3 slides) or 2–4 minute demo video