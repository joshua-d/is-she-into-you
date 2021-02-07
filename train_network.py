from neural_env import NeuralEnv


polarity_corpus_file_path = 'words.txt'
network_file_path = 'network.txt'
alphabet = 'abcdefghijklmnopqrstuvwxyz-'

polarity_to_output = {
    'weakpos': 1,
    'strongpos': 1,
    'weakneg': 0,
    'strongneg': 0,
    'neutral': 0.5,
    'both': 0.5
}


def load_polarity_corpus():
    polarity_corpus = []
    polarity_corpus_file = open(polarity_corpus_file_path)
    for line in polarity_corpus_file.readlines():
        word_polarity = line.replace('\n', '').split(' ')
        polarity_corpus.append({
            'word': word_polarity[0],
            'polarity': word_polarity[1]
        })
    return polarity_corpus


def word_to_input(word):
    input_list = []
    for i in range(10):
        if i >= len(word):
            input_list.append(0)
            continue
        char = word[i].lower()
        input_list.append(alphabet.index(char) / 26)

    return input_list


def init_nenv(polarity_corpus):
    nenv = NeuralEnv({
        'learning_style': 'backpropagation',
        'neurons': [10, 4, 1]
    })

    for word in polarity_corpus:
        input_list = word_to_input(word['word'])
        output_list = [polarity_to_output[word['polarity']]]
        nenv.add_training_data(input_list, output_list)

    try:
        nenv.import_network(network_file_path)
        print('Imported network.')
    except:
        pass

    return nenv


def train(nenv, fitness, inc=100):
    print('Training...')
    nenv.evaluate_fitness_backpropagation()
    while nenv.network.fitness > fitness:
        for i in range(inc):
            nenv.train()
        nenv.evaluate_fitness_backpropagation()
        print('Fitness: ' + str(nenv.network.fitness))
    print('Done.')


def main():
    polarity_corpus = load_polarity_corpus()
    nenv = init_nenv(polarity_corpus)
    try:
        train(nenv, 1000)
    except KeyboardInterrupt:
        pass
    nenv.export_network(nenv.network, 'network.txt')


if __name__ == '__main__':
    main()