from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.decomposition import PCA
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator
from sklearn.svm import SVC
import numpy as np
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from sklearn.decomposition import KernelPCA
 
class Classifier(BaseEstimator):
    def __init__(self): 
        self.n_components = 20
        self.learning_rate = 0.2
        self.clf = Pipeline([
           ('pca', KernelPCA(n_components=self.n_components,kernel='poly')),
                ('clf', QuadraticDiscriminantAnalysis())
        ])
 
        
    def fit(self, X, y):
        self.clf.fit(X, y)

    def predict(self, X):
        return self.clf.predict(X)

    def predict_proba(self, X):
        return self.clf.predict_proba(X)
