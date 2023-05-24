# Introduction to Python

## principles:
##  * minimize text
##  * keep things interesting
##  * provide rewards?
##  * prompt student to ask for help when they need it

from abc import abstractmethod
from dataclasses import dataclass

# QUESTIONS:
# - should we call it a 'tutor' or 'teacher'
# - should we give it a persona? an 'amigo' persona?
# - we'll want to think about the tone too
# - think more carefully about the theme (cooking vs something else)
# - we want to do some prompt engineering (simple vs complex answers)


# TODOS:
# - insert checkpoints
# - insert quizzes


@dataclass
class Step:
    order: int
    name: str
    code: str
    instructions: str
    questions: list[str]

    @abstractmethod
    def get_checkpoints():
        raise NotImplementedError


class Intro(Step):
    name = "introduction"

    code = """
    prompt = "Write a recipe for a delicious recipe"
    ingredients = ["chicken", "lemon", "garlic", "olive oil", "salt", "pepper"]
    generated_recipe = generate_recipe(prompt, ingredients)
    """
    instructions = """
    Welcome to the CodeAmigo introduction to Python. How much do you know about Python?
    If the answer is 'not a lot', congratulations -- you've come to the write place.
    Check out the code in the sandbox on your right. Click the <something> to run it.
    
    Oh wow -- looks like we've got an idea for dinner tonight! How did that happen?
    Lets keep going and find out. 
    """

    def __init__(
        self, order=0, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class Strings(Step):
    name = "Introduction to Variables and Strings"
    code = """
    prompt = "Write a recipe for a delicious recipe."
    """
    instructions = """
    Let's begin from the top. On the previous page, you saw that our AI assistant
    was able to generate a recipe for a meal. How did it know what we wanted? Well,
    it got that information from "prompt". "prompt" is what's called a variable. A
    variable is how computers store temporary information while they're executing a program.
    The format is always <name of the variable> = <some bit of information>. In this case,
    the information associated with the variable is what's called a 'string'. A string is a
    way of representing information that a person can read in a way that a computer can also
    understand.

    We won't go too much into the details. Instead, we'll show you what variables can do rather
    than try to explain what they are. That said, you probably have plenty of questions -- and
    you can put those to your AI assistant.
    """
    questions = [
        "What are strings used for in programming?",
        "Why is a 'string' called a 'string'",
        "Can a variable be called anything?",
    ]

    def __init__(
        self,
        order=1,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
    ):
        super().__init__(order, name, code, instructions, questions)


class StringUpdating(Step):
    # TODO: introduce errors? should checkpoint verify that `type(prompt) == str`?
    name = "Working with Variables and Strings"
    code = """
    prompt = "Write a recipe for a delicious recipe."
    prompt =
    """
    instructions = """
    Right now, the variable 'prompt' references the string 'create a delicious recipe'. But variables
    can be changed to represent other things. For instance, if we added another line of code on the next
    line that said: `prompt = "coconut"`, that would change the information saved by the variable. Try
    this out yourself by changing 'prompt' to something else -- any word or sentence that you feel like.
    """
    questions = ["Why would I want to update a variable?"]

    def __init__(
        self,
        order=2,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
    ):
        super().__init__(order, name, code, instructions, questions)


class StringPrinting(Step):
    # TODO: add checkpoints
    name = "Printing a Variable"
    code = """
    prompt = "Write a recipe for a delicious recipe."
    prompt = <whatever the user added>
    """
    instructions = """
    If you've made it here, then you've successfully updated the variable -- well done! How can
    we see that `prompt` no longer indicates 'create a delicious recipe'? There's a tool for that:
    Python has a command, `print`, that will let you see the value associated with a variable. Try
    it out yourself, you should see whatever you changed `prompt` to be pop up on the console on the
    right. You should just add `print(<some-variable>)` to the next line, then hit <run button>.
    """
    questions = [
        "What does the `print` statement actually do?",
        "What is a `console`?",
        "Why would I want to `print` things?",
    ]

    def __init__(
        self,
        order=3,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
    ):
        super().__init__(order, name, code, instructions, questions)


class StringIndexing(Step):
    # NB: the question returns some information about arrays -- we should probably try to prevent that
    #     prompt: "Can you answer the following question in extremely simple terms? \n Question: ```{question}```"
    #     works pretty well
    name = "Indexing Into Strings"
    code = """
    prompt = "<whatever the user added"
    first_char = prompt[0]
    """
    instructions = """
    Now we can start making things happen with strings. Much like the ingredients of a delicious recipe,
    there's a lot of slicing and dicing we can do with strings in Python. Lets start by grabbing one
    character of a string, more formally known as 'indexing' into a string. The code there will take
    the first letter or number of the string you made earlier and save it as its own variable. Try
    adding another line of code below to print `first_char` to the console.
    """
    questions = ["In Python, why is '0' the first index position instead of '1'?"]

    def __init__(
        self,
        order=4,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
    ):
        super().__init__(order, name, code, instructions, questions)


class StringSlicing(Step):
    # add something about the syntax [:]?
    name = "Slicing Strings"
    code = """
    opinion = "Pizza goes best with pineapple"
    string_slice = opinion[:20]
    """
    instructions = """
    Python will let you go much further than just getting a single character. Another technique,
    'slicing', will get the all of the characters up until the position in the string specified.
    Here, we're taking every character, starting from '0', until the character in the 20th position.
    Take note that you won't get the 10th character back (remember that Python starts at 0)!
    Try printing `sentence_slice`. Now, if you have a different opinion about pizza toppings,
    the 'opinion' string seems less objectionable.
    """
    questions = [
        "Why does Python only get the character up until the index I specified?"
    ]

    def __init__(
        self,
        order=5,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
    ):
        super().__init__(order, name, code, instructions, questions)


class StringDeleting(Step):
    name = "Deleting Strings"
    code = """
    opinion = "Pizza goes best with pineapple"
    string_slice = opinion[:20]
    del string_slice
    print(string_slice)
    """
    instructions = """
    What if, on the other hand, there's nothing you love more than pineapple on pizza? In that case,
    you're happy to let 'opinion' stay just the way it is. In fact, that someone would use Python's
    slicing capabilities to remove 'pineapple' from the rest of the sentence might make you angry!
    Possibly, you'd like to make `string_slice` go away forever. While we'd urge you to seek help
    if you're having these responses, Python does allow you to get rid of variables forever. You can do this
    by using `del`, which stands for 'delete'. A line of code which places `del` before a variable will
    permanently get rid of that variable. Execute the code. Now try printing `string_slice`. What happened?
    """

    def __init__(
        self, order=6, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class StringMultiplication(Step):
    # NB: ChatGPT provides a wrong answer when you ask it the question here!!
    name = "Multiplication and Strings"
    code = """
    opinion = "Pizza goes well with pineapple"
    number_of_times_to_repeat = 3
    print(opinion * 3)

    """
    instructions = """
    What if you were so excited about pineapple on pizza that you wanted to say it several times?
    Well, you're still making us nervous, but you can do math with Python. And if you can do math,
    then you can multiply things -- including strings! The third line of code in the editor includes
    a new character - '*'. This allows you to multiply strings by numbers, and numbers by other numbers.
    Executing the code and see what we get.
    """
    questions = [
        "Why can't I multiply two strings together but can multiply a string by a number?"
    ]

    def __init__(
        self,
        order=7,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
    ):
        super().__init__(order, name, code, instructions, questions)


class StringConcatenation(Step):
    # NB: ChatGpt provides a wrong answer when you ask it the question here!!
    # quiz idea: slice a string, create a new variable with a topping, add it to the slice
    name = "Addition with Strings"
    code = """
    opinion = "Pizza goes well with pineapple"
    opinion_slice = opinion[:20]
    best_topping = <user input>
    your_opinion = opinion_slice + best_topping
    print(your_opinion)

    """
    instructions = """
    We can do all of the other mathematical operations as well. If you're not a fan of pineapple
    on pizza, try running the code to express your ideas about which toppings belong on pizza. One thing
    to note is that this operation is, in effect, addition, in formal terms it is called a 'concatenation'.
    Concatenation is a special term that means 'to put strings together', and only applies to strings.
    """
    questions = ["What is the difference between addition and concatenation?"]

    def __init__(
        self, order=8, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class InvalidStringArithmatic(Step):
    # might be too much
    name = "Math that Won't Work on Strings"
    code = """
    opinion = "Pizza goes well with pineapple"
    chars_to_subtract = "pineapple"
    print(opinion - chars_to_subtract)
    """
    instructions = """
    We've seen that strings can be multiplied and concatenated. But try to run the code in the editor here and
    -- oh no. What is going on? Take a look at the output on the console. You might not know exactly
    what this is trying to tell you, but seeing the word 'Error' is a sure sign that something has gone
    wrong. More on 'Errors' in a moment.
    For now, just know that this is telling us that strings can't be subtracted from other strings.
    The same is true of strings and numbers; you can't subtract a number from a
    string.
    
    Why? In programming terms, this is because the division and subtraction operations in
    Python are 'not well defined' for anything except for numbers. If we remember that a 'string' is
    like a bunch of beads tied together on a string, it makes sense that you would be able to take a
    pattern of beads that you already have and make it over again a few times (which would be like a multiplication),
    or that you could add one string of beads with another and tie them together to make a new string -- but
    try to imagine the same thing with subtraction or division -- it doesn't quite work. You can ask the AI assistant for
    more details on this, but just know that it means that nobody really knows how subtraction with
    strings would work.
    """
    questions = [
        "What does it mean for something to be 'not well defined' in a programming language?"
    ]

    def __init__(
        self,
        order=9,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
    ):
        super().__init__(order, name, code, instructions, questions)


class Errors(Step):
    name = "Introducing Errors"
    code = """
    opinion = "Pizza goes well with pineapple"
    chars_to_subtract = "pineapple"
    print(opinion - chars_to_subtract)
    """
    instructions = """    
    On the last slide, we had our first encounter with an `Error`. Over the course of your time
    as a programmer, you're going to see *quite a lot* of these. At
    first they're alarming, potentially even overwhelming, but you'll learn to love them -- they're
    there to tell you that something is wrong with your code. They're even nice enough to
    tell you exactly what the problem is. An error message has two main parts:
        - which kind of error it is
        - the traceback
    The kind of error, in this case, a `TypeError` is like a general assessment of what's gone
    wrong with your code. This one has to do with the issue mentioned on the last slide; the 'types'
    of the things we tried to divide aren't compatible with the operation of divison.
    The other part of the error is the traceback. The traceback is a complete train, line by line,
    of every piece of code that ran before the error happened. Don't pay too much attention to the traceback
    for now, it can often be a lot of text to dig through, but it be very helpful once you're tackling more advanced programming.
    """

    def __init__(
        self, order=10, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class DataTypes(Step):
    name = "Math and Strings"
    code = """
    prompt = <user string>
    other_string = " and I'm another string"

    print(prompt * 3)
    print(prompt + other_string)

    """
    instructions = """
    You might have raised an eyebrow at the mention of 'types' on the previous page. What is a type?
    # TODO: finish
    """

    def __init__(
        self, order=4, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class StringSplitting(Step):
    pass
