#The base Model class - abstract class, should not be instantiated directly
class Model():
    def __init__(self):
        pass

    # Fits the model to the given data stream of the form ((name1, data1), (name2, data2), ...)
    # May require other arguments depending on which type of model is created (tagged vs. untagged)
    # See specific subclasses for more information.
    def fit(self, data_stream, **kwargs):
        raise NotImplementedError

    # Returns a list of matches to the input_data.
    # The number of matches is chosen on creation of the model.
    # The threshold should be a value between 0 and 1, to limit how close matches should be.
    # 0 means only return perfect matches, 1 means no thresholding - any number in between is possible.
    def get_matches(self, input_data, threshold):
        raise NotImplementedError
