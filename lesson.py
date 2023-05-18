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
    prompt = "Write a recipe for a delicious"
    ingredients = ["chicken", "lemon", "garlic", "olive oil", "salt", "pepper"]
    generated_recipe = generate_recipe(prompt, ingredients)
    """
    instructions = """
    Welcome to the CodeAmigo introduction to Python. How much do you know about Python?
    If the answer is 'not a lot', then congratulations -- you've come to the write place.
    Check out the code in the sandbox on your right. Click the <something> to run it.
    
    Oh wow -- looks like we've got an idea for dinner tonight! How did that happen?
    Lets keep going and find out. 
    """
    def __init__(self, order=0, name=name, code=code, instructions=instructions, questions=[]):
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
    questions = ["What are strings used for in programming?", "Why is a 'string' called a 'string'"]
    def __init__(self, order=1, name=name, code=code, instructions=instructions, questions=questions):
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
    def __init__(self, order=2, name=name, code=code, instructions=instructions, questions=questions):
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
    questions = ["What does the `print` statement actually do?", "What is a `console`?", "Why would I want to `print` things?"]
    def __init__(self, order=3, name=name, code=code, instructions=instructions, questions=questions):
        super().__init__(order, name, code, instructions, questions)

class StringSlicing(Step):
    pass

class StringDeleting(Step):
    pass

class StringSplitting(Step):
    pass

class StringArithmatic(Step):
    # TODO: add motivations somewhere - eg. why would i 'want to do' anything with a string?
    name = "Math and Strings"
    code = """
    prompt = <user string>
    other_string = " and I'm another string"

    print(prompt * 3)
    print(prompt + other_string)

    """
    instructions = """
    There's plenty more that you can do with strings, like some arithmatical operations.
    Try using the '*' character to multiply `prompt` by `3`. You can also add two strings together.
    """
    def __init__(self, order=4, name=name, code=code, instructions=instructions, questions=[]):
        super().__init__(order, name, code, instructions, questions)

class Errors(Step):
    # NB: too much text?
    name = "Introducing Errors"
    code = """
    prompt = <user string>
    
    print(prompt - 2)

    """
    instructions = """
    One thing to keep in mind is that you can't substract or divide strings. If we remember that
    a 'string' is like a bunch of beads tied together on a string, it makes sense that you would
    be able to take a pattern of beads that you already have and make it over again a few times
    (which would be like a multiplication), or that you could add one string of beads with another and
    tie them together to make a new string -- but try to imagine the same thing with subtraction or
    division -- it doesn't quite work.
    
    If you run the code there, you'll see what's called an error. Over the course of your time
    as both a student and as a career programmer, you'll be seeing *quite a lot* of these. At
    first they're alarming and potentially overwhelming, but you'll learn to love them -- they're
    there to tell you that something is wrong with your code, and are often nice enough to
    tell you exactly what the problem is. An error message has two main parts:
        - which kind of error it is
        - the traceback
    The kind of error, in this case, a `TypeError` is like a general assessment of what's gone
    wrong with your code. Here, the 'types' of the things we tried to divide aren't compatible
    with the operation of divison.
    The other part of the error is the traceback; this is a detailed, line by line report about
    what the problem is. Don't pay too much attention to it now, it can often be a lot of text
    to dig through, but it be very helpful once you're tackling more advanced programming.
    """
    questions = ["Why can I multiply a string by can't divide it?"]
    def __init__(self, order=5, name=name, code=code, instructions=instructions, questions=[]):
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
    def __init__(self, order=4, name=name, code=code, instructions=instructions, questions=[]):
        super().__init__(order, name, code, instructions, questions)