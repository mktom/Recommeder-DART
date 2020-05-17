from model.tagged_model import TaggedModel
import json
import cv2
# TODO error checking
from functools import lru_cache
import ntpath
import os

_model_map = {}

# This is so that we can iterate over our data streams multiple times.
def multigen(gen_func): # source: https://stackoverflow.com/questions/1376438/how-to-make-a-repeating-generator-in-python
    class _multigen(object):
        def __init__(self, *args, **kwargs):
            self.__args = args
            self.__kwargs = kwargs
        def __iter__(self):
            return gen_func(*self.__args, **self.__kwargs)
    return _multigen

@multigen
def _to_data_stream(file_list):
    for f in file_list:
        data = cv2.imread(f)
        data = cv2.resize(data, dsize=(32,32), interpolation=cv2.INTER_CUBIC)
        yield (ntpath.basename(f), data)


@lru_cache()
def load_model(name, tr_files, tg_file, ctype='image'):
  print("Started Model Training...")
  if len(tg_file) > 0: # Tagged Model
    model = TaggedModel(ctype, 3)
    
    # training/tag files location
    tf_location = f'server/uploads/{ctype}/files/{name}'
    tg_location = f'server/uploads/{ctype}/tags/{name}'
      
    tg_file = f'{tg_location}/{tg_file[0]}'
    with open(tg_file) as tag_file:   
        tags = json.load(tag_file)

    print("Started Model Fitting...")
    model.fit(_to_data_stream([f'{tf_location}/{f_name}' for f_name in tr_files]),tags)
    print("Finished Model Training...")
    return model 

  else:
    raise NotImplementedError

def create_model(name, data, tags, type):
    pass

def get_result_from_model(name, input_data, tr_files, tg_file, ctype='image'):
    model = load_model(name, tr_files, tg_file, ctype)
    tst_location = f'server/uploads/{ctype}/test/{name}'
    return model.get_matches(f'{tst_location}/{input_data}')