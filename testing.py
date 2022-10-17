import random

cmajor = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

harmonies = [[1, 4, 6], [2, 5, 7], [3, 6, 1], [4, 7, 2], [5, 1, 3], [6, 2, 4], [7, 3, 5]]



#input a melody line as int array of scale degrees, e.g. [1, 2, 5, 3, 6, 4, 3, 5, 7, 1]
def suggestHarmony(notes):
    for note in notes:
        print(random.choice(harmonies[note-1]))


melody = [1, 2, 5, 3, 6, 4, 3, 5, 7, 1]

suggestHarmony(melody)
    
        
