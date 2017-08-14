import numpy as np
# import pandas as pd
from scipy import signal as signal

class FeatureExtractorClf():
    def __init__(self, window_length=15, polyorder=5):
        self.window_length = window_length
        self.polyorder = polyorder

    def fit(self, X_df, y):
        return self

    def transform(self, X_df):
        XX = np.array([np.array(dd) for dd in X_df['spectra']])
        XX = signal.savgol_filter(XX, axis=1, window_length=self.window_length, polyorder=self.polyorder, mode='nearest')
        XX = signal.detrend(XX, axis=1)
        return XX