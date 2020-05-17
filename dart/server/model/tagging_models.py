import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import cv2

# Currently not implemented - would be a model to tag text.
class TextTaggingModel():
    def __init__(self):
        pass

    def fit(self, data_stream, tags):
        pass

    def eval(self, input_data):
        pass

# A convolutional neural network implementation. See PyTorch documentation for specifics.
# Architecture described in report. Two 2d-convolutional layers each followed by a 2d-max pool. 
# Three fully connected dense layers.
# n should be the size of the one hot encoded tags.
class CNN(nn.Module):
    def __init__(self, n):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, n)

    # See PyTorch documentation for explanation on how the neural network interface works.
    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 16 * 5 * 5)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

# Image models to automatically tag input images
class ImageTaggingModel():
    def __init__(self):
        self.model = None

    # Fits the tagging model to a given datastream (as defined in Model)
    # The encoded tag map should be a map from image names in the data stream to their 
    # Corresponding one-hot-encoded tags.
    # Num_tags is the total number of tags in the tagged dataset.
    # This should not need to be used for most cases - it is utilised by TaggedModel.
    def fit(self, data_stream, encoded_tag_map, num_tags):
        self.model = CNN(n=num_tags)


        # print(encoded_tag_map)

        # See PyTorch documentation - Binary Cross Entropy since we have a multi-class problem
        # Where more than one class is allowed.
        criterion = nn.BCEWithLogitsLoss()
        optimizer = optim.Adam(self.model.parameters(), lr=0.001)

        EPOCHS = 100
        for epoch in range(EPOCHS):
            running_loss = 0.0

            for (name, data) in data_stream:
                data = torch.from_numpy(data).unsqueeze(0).transpose(1,3) / 256.0
                label = torch.from_numpy(encoded_tag_map[name]).unsqueeze(0)
                optimizer.zero_grad()

                outputs = self.model(data)
                if epoch == EPOCHS - 1:
                    # print(name)
                    print(torch.sigmoid(outputs))
                loss = criterion(outputs, label)
                loss.backward()
                optimizer.step()
                running_loss += loss.item()

    # Evaluates the input data and returns an approximation of encoded tags for the input data.
    def eval(self, input_data):
        data = cv2.imread(input_data)
        data = cv2.resize(data, dsize=(32,32), interpolation=cv2.INTER_CUBIC)
        data = torch.from_numpy(data).unsqueeze(0).transpose(1,3) / 256.0
        output = torch.sigmoid(self.model(data)).detach()[0].numpy()

        return output
