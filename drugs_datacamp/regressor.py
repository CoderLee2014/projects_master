from sklearn.ensemble import GradientBoostingRegressor
from sklearn.decomposition import PCA
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator
import numpy as np
from sklearn.decomposition import KernelPCA
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis


class Regressor(BaseEstimator):
    def __init__(self):
        self.n_components = 8
        self.learning_rate = 0.2
        self.list_molecule = ['A', 'B', 'Q', 'R']
        self.dict_reg = {}
        for mol in self.list_molecule:
            self.dict_reg[mol] = Pipeline([
                ('pca', KernelPCA(n_components=self.n_components,kernel='poly',
                                 eigen_solver='arpack')),
                ('clf', QuadraticDiscriminantAnalysis(reg_param=0.0000000000001))
            ])

    def fit(self, X, y):
        for i, mol in enumerate(self.list_molecule):
            ind_mol = np.where(np.argmax(X[:, -4:], axis=1) == i)[0]
            XX_mol = X[ind_mol]
            y_mol = y[ind_mol].astype(float)
            self.dict_reg[mol].fit(XX_mol,y_mol)

    def predict(self, X):
        y_pred = np.zeros(X.shape[0])
        for i, mol in enumerate(self.list_molecule):
            ind_mol = np.where(np.argmax(X[:, -4:], axis=1) == i)[0]
            XX_mol = X[ind_mol].astype(float)
            y_pred[ind_mol] = self.dict_reg[mol].predict(XX_mol)
        return y_pred
