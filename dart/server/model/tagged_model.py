from sklearn.neighbors import NearestNeighbors, DistanceMetric
from sklearn.metrics.pairwise import cosine_distances
from sklearn.preprocessing import OneHotEncoder
from scipy.spatial.distance import cosine as cos_dist
from bidict import bidict
import numpy as np
import json
import itertools
from model.model import Model
from model.tagging_models import TextTaggingModel, ImageTaggingModel

import os
import sys

# Implementation of the Model class. This model requires tagged data to function.
# See specific functions for more information.
class TaggedModel(Model):
    
    # The file format of the model (currently supported: 'text', 'images') (actually, text is not fully supported yet)
    # num_results is the number of results to return for matches. Default: 9
    def __init__(self, file_format, num_results=9):
        self.file_format = file_format
        if file_format == 'text':
            self._tagging_model = TextTaggingModel()
        elif file_format == 'image':
            self._tagging_model = ImageTaggingModel()
        else:
            raise NotImplementedError(f'The {file_format} format is not currently supported.')
        self._num_results = num_results
        self._name_index_map = bidict()
        self._tag_to_id_map = None
        self._all_tags = None
        self.vectors = None
    
    # returns the one-hot-encoding of 'tags'
    def _encode(self, tags):
        X = np.zeros(len(self._all_tags))
        for tag in tags:
            if tag in self._all_tags:
                X[self._tag_to_id_map[tag]] = 1
        return X

    # data_stream is a stream of (name, file) pairs 

    # [(actual image data/text data, name of the file), ...], {name: [tags]}
    # Fits and trains the model to the given data. 'tags' should be a dictionary from strings to list of strings,
    # which maps the name of each training data to the corresponding tags.
    def fit(self, data_stream, tags):

        tag_data = []

        for index, (name, data) in enumerate(data_stream):
            self._name_index_map[index] = name 
            tag_data.append(tags[name])


        self._all_tags = set(itertools.chain.from_iterable(tag_data))
        self._tag_to_id_map = {tag: idx for idx, tag in enumerate(self._all_tags)}

        X = np.zeros((len(tag_data), len(self._all_tags)))
        for index, data in enumerate(tag_data):
            X[index] = self._encode(data)
        self.vectors = X

        encoded = {
            n: self._encode(t)
            for n, t in tags.items()
        }

        self._tagging_model.fit(data_stream, encoded, len(self._all_tags))

    # returns a match based off a one-hot-encoded tags.
    # num - number of matches to return (Default: 5)
    # threshold - the threshold of similarity at which to cut off results (default 0.7)
    def _get_tagged_matches(self, enncoded_tags, num=5, threshold=0.7):
        distances = sorted([(i, cos_dist(enncoded_tags, d)) for i, d in enumerate(self.vectors)], key=lambda x: x[1])
        return [self._name_index_map[index] for index, dist in distances[:min(len(distances), self._num_results)] if dist < threshold ]
    
    # See Model.get_matches
    def get_matches(self, input_data, threshold=0.7):
        input_tags = self._tagging_model.eval(input_data)
        return self._get_tagged_matches(input_tags, threshold)
