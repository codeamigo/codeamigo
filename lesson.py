# Introduction to Python

## principles:
##  * minimize text
##  * keep things interesting
##  * provide rewards
##  * prompt student to ask for help when they need it

# intro
intro = {
    "instructions": """Why do you want to learn Python? If its because you've heard
        its the language of AI, then you're in the right place.
        We're going to take an unusual approach to this lesson
        by relying on you, the student, to guide your own learning.
        But you won't be alone -- ask the AI assistant for help
        whenever you need it. Move through the lesson in a flash,
        or go as in depth as you'd like, the assistant should have
        you covered.
    """,
    "code:": """
    from transformers import pipeline

    feeling = "incredibly excited to be learning Python"
    classifier = pipeline("sentiment-analysis")
    prediction = classifier(feeling)
    print(prediction)
    """,
}

lesson1 = {
    "instruction": """What happened on the previous page? If you don't
    understand a bit of it, that's just fine. Mature software often hides
    a lot of the details, which makes things less complicated, but can also
    seem opaque if you'd like to know what the code is actually doing.
    We're going to take a few big steps back, and before we start learning
    anything about how machine learning models work, we're going to dig into 
    one basic fact about any kind of machine learning model: they only
    understand numbers. As a starter project, lets take a message that a
    person would understand and use Python to turn it into a medium that
    would make sense to a large language model. Run the code to see how a
    large language model might say 'hello'.
    """,
    "code": """import torch

    english_hello = "hello world"
    machine_hello = torch.rand(len(english_hello)))

    print(machine_hello)
    """,
}

lesson1 = {
    "instruction": """'hello world' or 'incredibly excited to be learning
    python' are what is called, in computer science terms, strings. A string
    is a data type representing a sequence of characters. But before I drone on,
    why don't you ask the AI assistant for some help. For instance, what is a 
    data type? Can a string only be made up of letters? Ask the assistant as
    many (or few!) questions as you need to feel you've got a good handle
    on the material.
    """,
    "code": """
    letter_string = "boop"
    mixed_string = "100 boops"
    punctuation_string = "boop's 100"
    """,
}

# here's a sentence that we'd like to send to a chatbot:
sentence = "hello world"

# `sentence` is what is called a `variable`. This is how computer programs
# can reference the same piece of information more than once. You can think
# of a variable (`sentence`) as temporarily saving the value ("hello world")

# "hello world" is what is called a string. A string is a representation of
# characters, often used when representing text.

# lets begin by turning the string data type into a data structure. A
# data structure is a way programming languages can keep track and organize
# data


sentence_list = sentence.split(" ")

print(sentence_list)

# `split` is what is called a `method` -- that is a function that a certain
# class is able to execute.
# NOTE: what is a function? what is a class?

# lets use another built-in function to turn each string in `sentence_list`
# into a number

word_numbers = []
for num, word in enumerate(sentence_list):
    word_numbers.append(num)

print(word_numbers)

# so, we can think of the number `0` as representing `hello`, while `1` represents `world`
# now what we'd like to do is be able to quickly get the number version of a word originally
# represented by a string. for this, we can use another data structure called a `dictionary`
# NOTE: what is a loop? what is `zip`?
word2num = {}
for word, num in zip(sentence_list, word_numbers):
    word2num[word] = num

print(word2num)

# a dictionary organizes data by having keys and values. A key can be plugged into the dictionary
# to access values. So if we wanted to see which number represents a word, we can
# use the dictionary to get the numeric value

print(word2num["hello"])

# to make our dictionary converting strings to integers more useful, we want to add
# as many words as we can. Lets repeat the same thing we did earlier, but with
# many more words

# the url below contains a list of almost every word in the english language
# lets download it and add the new words to our dictionary

words_url = "https://raw.githubusercontent.com/dwyl/english-words/master/words.txt"

# we'll use a library (code that someone else already wrote for us!) to retrieve
# the words from where they're stored on the internet

import httpx

response = httpx.get(words_url)

print(response)

# you should see `<Response [200 OK]>`. This means that we successfully
# made a web request to the website where the word list is hosted

# when we make an http request to a website, we can get back the data that
# we asked for by extracting `text` from the http response. lets save that
# data in a new variable

response_text = response.text

# lets take a quick look at what came back:

print(response_text[30:150], sep="")

# we can see that there is a `\n` between every word. this is called a 'newline character',
# and whenever a python program sees '\n', it will put the next bit of input on its own line
print("without newline")
print("with \n newline")


# now, Python has interpreted the words text as one gigantic string. Lets break the
# words up so that they are easier to work with one at at a time. How do we break them up?
# When we wanted to split "hello world" from a string into a list of strings, we saw that
# 'hello' was separated from 'world' with a space character. now, the words are separated
# by a newline character, so we can split the string into a list of strings using every time
# a newline character shows up as the separator:

list_of_lots_of_words = response_text.split("\n")

print(list_of_lots_of_words[:10])

# and voila! now we can work with each word one at a time. If you want to look
# at an item in one particular place of the list, you can access it by indexing the list.
# You can do that with the following bit of code:
print(list_of_lots_of_words[110])

# TODO:
#  - add string manipulations
#  - add something on methods and classes
#  - more about lists (slices, indexing, appending)
#  - add something about loops
#  - add explanation of built-in function
#  - add explanation of functions
#  - stuff about http
