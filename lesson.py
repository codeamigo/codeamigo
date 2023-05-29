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
    If the answer is 'not a lot', congratulations -- you've come to the right place.
    Check out the code in the editor below. Click the 'Run' button to run it.
    
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
    you can put those to your AI assistant. Select from some of the questions in the bottom-right hand
    corner or ask your own question.
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
    prompt = "Write a delicious recipe."
    prompt =
    """
    instructions = """
    Right now, the variable 'prompt' references the string 'Write a delicious recipe.'. But variables
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
    prompt = "Write a delicious recipe."
    prompt = "coconut"
    """
    instructions = """
    If you've made it here, then you've successfully updated the variable -- well done! How can
    we see that `prompt` no longer indicates 'create a delicious recipe'? There's a tool for that:
    Python has a command, `print`, that will let you see the value associated with a variable. Try
    it out yourself, you should see whatever you changed `prompt` to be pop up on the console on the
    right. You should just add `print(<some-variable>)` to the next line, then hit 'Run'.
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
    'slicing', will get the all of the characters up until a specified position in the string.
    Here, we're taking every character, starting from '0', until the character in the 20th position.
    Take note that you won't get the 20th character back (remember that Python starts at 0)!
    Try printing `sentence_slice`. Now, if you have a different opinion about pizza toppings,
    the 'opinion' string seems less objectionable.
    """
    questions = [
        "Why does Python only get the character up until, but not including, the index that I specified?"
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
    # TODO: discuss quippiness factor
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
        "Why can't I multiply 'pineapple' * 'pineapple', but I can multiply 'pineapple' by 3?"
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
        self,
        order=8,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
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
    If this is your first Error, don't panic! For now, just know that this is telling us that strings can't be subtracted from other strings.
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
    for now, it can often be a lot of text to dig through, but it will be very helpful once you're tackling more advanced programming.
    """

    questions = [
        "What other kinds of errors will I encounter? How do I know what they mean?",
        "What is a traceback?",
    ]

    def __init__(
        self, order=10, name=name, code=code, instructions=instructions, questions=questions
    ):
        super().__init__(order, name, code, instructions, questions)


class StringDataTypes(Step):
    # skipping over explanation of '==' and booleans
    # does this introduce too much new stuff all at once?
    name = "Data Types"
    code = """
    string_one = "I am a string"
    string_two = "I am also a string"
    print(type(string_one))
    print(type(string_two))


    """
    instructions = """
    The error that was saw on the last slide was a 'TypeError'. We now have some idea of what an 'error' is,
    but what about a 'type'? In Python, and programming languages generally, 'types' are just like what they
    sound like; a category of thing. Python has several important types that you'll use when programming. So
    far, we've mostly been working with strings. An individual string, like 'I am a string', will have a 'type'
    of 'str' (which is short for string). Every other string you might make will also be of type 'str'.
    Try running the code, you should see that the two strings have the same type. Strings are far from the only
    type that exist in Python. Let's keep going to check out a few others!
    """

    def __init__(
        self,
        order=11,
        name=name,
        code=code,
        instructions=instructions,
        questions=["Why are types important in Python?"],
    ):
        super().__init__(order, name, code, instructions, questions)


class SequenceDataTypes(Step):
    # how do i refer to them? types? objects? again with an eye towards keeping introduced stuff to a minimum
    ## also concerned that this introduces too much abstraction -- discuss
    name = "Introduction to Sequences"
    code = """
    opinion = "I'd like a pizza with "
    toppings = ["pepperoni", "mushrooms", "pineapples"]
    print(opinion + toppings[0])
    """
    instructions = """Remember how we said earlier that a string is called a string because partially
    it's supposed to represent a bunch of beads tied together on a string? Imagine taking the string and sliding each
    character off of the string one at a time. Doing this would be treating the beads as a "sequence"; you take
    the whole thing and do something to each of its parts. This is something that a Python string *can* do, but it
    isn't the main purpose of a string -- that would be to communicate information.
    
    There is, however, a type that sequences things as its main job. This is called a `list`.
    A list in Python is also similar to what a list is in the ordinary sense of the word. That is, a
    way of keeping track of a bunch of things.
    In Python, you can create a list by enclosing whatever you want to keep track of in square brackets. Check out
    the code below to see an example of a list of pizza toppings. You'll note that the list
    contains three strings. Remember when we did indexing and slicing with strings? You can do the same thing with
    lists! See how you can index into a `list` by running the code.
    """

    def __init__(
        self, order=12, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class ListSlice(Step):
    name = "Slicing Lists"
    code = """
    toppings = ["pepperoni", "mushrooms", "pineapples"]
    print(toppings[:2])
    """
    instructions = """On the last slide, you probably noticed that there's a difference between what happens
    when you index into a string and what happens what you index into a list. Indexing into a string only gives you
    the character at that position, but a list will give you back whatever you happen to have in the list at that
    index. In this case -- its a whole string! The same thing is true of slicing lists; instead of just a character,
    you'll get everything up until the index that you specified. Try it out if you want to see the list of toppings
    without including pineapples!
    """

    def __init__(
        self, order=13, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class Mutability(Step):
    # nb: probably needs more by way of explanation, might be confusing
    name = "Mutable or Immutable?"
    code = """
    toppings = ["pepperoni", "mushrooms", "pineapples"]
    first_two_toppings = toppings[:2]
    print(first_two_toppings)
    print(toppings)
    """
    instructions = """
    One thing we should mention is that when you `slice` a `list`, we don't actually make any
    permanent changes to the `list`. Actually, slicing a list will return a new list entirely,
    and that new list will return just the things in the list up until the index. So instead of
    just printing the results of `some list[:some index]`, you can save the result of slicing the
    original list as a new variable. If you run the code, you'll see that `toppings` is exactly
    the same as before we took the slice from it. This is because slicing is meant just to serve the purpose
    of accessing things in the list. There are other operations that will change the list forever!
    In Python, some types (like lists) are what is called 'mutable'. This means that its okay to
    change them. Other types (like strings) are 'immutable', meaning that they have to stay the way
    that they are from the moment that they were created.

    """
    questions = ["If strings are immutable, why can you concatenate them?"]

    def __init__(
        self,
        order=14,
        name=name,
        code=code,
        instructions=instructions,
        questions=questions,
    ):
        super().__init__(order, name, code, instructions, questions)


class ListPop(Step):
    name = "Popping from Lists"
    code = """
    toppings = ["pepperoni", "mushrooms", "pineapples"]
    just_pineapple = toppings.pop()
    print(toppings)
    print(just_pineapple)
    """
    instructions = """
    Before we take a look at an operation that will permanently change a list -- we want to give you
    a round of applause. Congratulations on making it this far in the lesson, we're very happy to be
    learning with you.
    And now, let's introduce a way to remove pineapples from the list of ingredients...forever!
    `pop` is what's called a `method`. A `method` is something that a thing, like a list, can do.
    When a list "pops", it will get rid of whatever item is at the very end of the list. If you pop
    from a list, you can save the result as a variable, but otherwise, that last item is permanently
    removed from the list. Think of the list as one of those machines that shoots out tennis balls.
    Once the machine pops one out, you can catch it or do something else with it, but its
    definitely no longer in the machine with the other tennis balls.
    Execute the code, you can see that `pineapples` gets assigned to a new variable `just_pineapple`
    after being popped out of `toppings`. Now `toppings` only includes `pepperoni` and `mushrooms`!
    """

    def __init__(
        self, order=15, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class ListAppend(Step):
    # add a thing about what kind of stuff you can append?
    name = "Appending to Lists"
    code = """
    toppings = ["pepperoni", "mushrooms", "pineapples"]
    just_pineapple = toppings.pop()
    toppings.append(just_pineapple)
    print(toppings)
    another_topping = "olives"
    toppings.append(another_topping)
    print(toppings)
    """
    instructions = """
    We've jettisoned pineapple from our list of toppings. What if we have second thoughts?
    Very possibly, there's a reason so many people like it on pizza. What if we wanted to
    put it back into the ingredients list? Fortunately, we still have pineapple on hand; its
    saved in the `just_pineapple` variable, and even more luckily, we can take that variable
    and put it back into `toppings`. How? With the `append` method. `append` is another thing
    that lists can do. Which makes sense: you take things off of a list, and you can add things
    on.
    """

    def __init__(
        self, order=16, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class ListIter(Step):
    name = "Looping through Pizza Toppings"
    code = """
    toppings = ["pepperoni", "mushrooms", "pineapple", "olives"]
    pizza = 'Pizza with: '
    for topping in toppings:
        pizza += topping + ' '
    print(pizza)
    """
    instructions = """
    We've played around with lists a bit, and we've seen how we can access the things in a list, and how we can
    change the list itself. Now, let's see how we can use lists to do something interesting. Let's say that we
    want to make a pizza, and we want to add all of the toppings to it. We could do this by writing a line of
    code for each topping, but that would be a lot of code. Instead, we can use a `for` loop to loop through
    the list of toppings, and add each one to the pizza. The `for` loop will go through each item in the list,
    and assign it to a variable. In this case, we're calling that variable `topping`. Then, we can use that
    variable to do something with each item in the list. In this case, we're adding it to the string `pizza`.
    Run the code, and you'll see that we've made a pizza with all of the toppings!
    """
    questions = [
        "How can we modify the code to skip a topping if we don't want it on the pizza?",
        "What if we want to perform a different action for each topping?",
        "Can we access the index of each topping while looping through them?",
    ]

    def __init__(
        self, order=17, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)

class EqualsOperator(Step):
    name = "The Equals Operator"
    code = """
    toppings = ["pepperoni", "mushrooms", "pineapple", "olives"]
    pizza = 'Pizza with: '
    for topping in toppings:
        if topping == 'pineapple':
            continue
        pizza += topping + ' '
    print(pizza)
    """
    instructions = """
    Often times when programming, we want to check whether two things are the same. This is where the '==' operator comes in handy. In the code below, we're using the '==' operator to check whether the current topping is 'pineapple'. If it is, we're using the 'continue' keyword to skip that topping. Otherwise, we're adding it to the pizza. Run the code, and you'll see that we've made a pizza with all of the toppings except pineapple!
    """

    def __init__(
        self,
        order=12,
        name=name,
        code=code,
        instructions=instructions,
        questions=["What does the '==' operator do?"],
    ):
        super().__init__(order, name, code, instructions, questions)


class Functions(Step):
    name = "Functions"
    code = """
    def bake_pizza(toppings):
        pizza = 'Pizza with: '
        for topping in toppings:
            pizza += topping + ' '
        return pizza
    """
    instructions = """
    We've seen how we can use a `for` loop to do something with each item in a list. But what if we want to do
    that same thing with a different list? We could copy and paste the code, but that would be a lot of code.
    Instead, we can define a function. A function is a way to define a block of code that we can use over and
    over again. In this case, we're defining a function called `bake_pizza`. This function takes one argument,
    which we're calling `toppings`. Then, we're doing the same thing that we did before: looping through the
    list of toppings, and adding each one to the pizza. But now, we can use this function to bake a pizza with
    any list of toppings that we want!
    """
    questions = [
        "What if we want to bake a pizza with no toppings?",
        "What if we want to bake a pizza with only one topping?",
    ]

    def __init__(
        self, order=18, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)

class FunctionArguments(Step):
    name = "Function Arguments"
    code = """
toppings = ['pineapple', 'pepperoni']
size = 'extra large'
def bake_pizza(toppings, size):
  pizza = 'Pizza with: '
  for topping in toppings:
    pizza += topping + ' '
  pizza += 'of size ' + size
  return pizza

print(bake_pizza(toppings, size))

    """
    instructions = """
    We've created our first function, but where did the argument `toppings` come from? And what is an argument,
    anyway? No, not that kind of argument! An argument is a value that we pass to a function. In this case, we're passing the list of toppings
    to the function. We can also pass multiple arguments to a function. In this case, we're passing the list of
    toppings, and the size of the pizza. Then, we're adding the size of the pizza to the end of the string.
    """
    questions = [
        "How many arguments can we pass to a function?",
        "Does the order of the arguments matter?",
    ]

    def __init__(
        self, order=19, name=name, code=code, instructions=instructions, questions=questions
    ):
        super().__init__(order, name, code, instructions, questions)


class Objects(Step):
    # this one is very hard to explain simply, probably need to break methods out into another step
    # TODO: cover attributes
    name = "Introduction to Objects"
    code = """
class Chef:
  def __init__(self, name, favorite_food):
    self.name = name
    self.favorite_food = favorite_food
    
  def cook(self, recipe):
    print(recipe)

pizza_chef = Chef(name="georgio", favorite_food="pizza")
seafood_chef = Chef(name="fisherman bob", favorite_food="clam chowder")
our_recipe = "spaghetti"
pizza_chef.cook(our_recipe)
seafood_chef.cook(our_recipe)
    """
    instructions = """
    So far, all of the different things we've been working with in Python have just been floating
    around; variables, types, functions. Prepare to have your mind blown; these are all, in
    conceptual terms, the same thing. That thing is called an 'object'. Objects are ways of
    representing some concept 'in general'. By 'in general', we mean that there's no single thing
    that you can point to as 'the object'. When there is a specific example of a general idea, 
    you call that an 'instance' of an object.
    Think about the concept of a chef. 'chef' itself only exists as an idea. We can't go somewhere
    out in the world and see or touch 'chef', but there are lots of *instances* of chefs out there.
    We could sneak into the kitchen of a restaurant and see an instance of the general idea of a
    chef hard at work. We might be asked to leave the restaurant after, but we would have gotten
    evidence of an instance of a chef.
    This is slightly weird to wrap your head around, since the biggest difference between something in
    the real world and a thing that exists in Python is that everything in Python is abstract. So a chef
    object is an abstraction representing an abstraction, and a chef instance is an abstraction representing
    one individual thing. If that isn't quite sticking, take a look at the code in the editor.
    
    We have an object (the idea of a chef), which we make in Python with `class Chef`. We can
    create individual chefs, who have their own particular things that make them special, by
    'instantiating' the class. 'instantiating' basically just means to make an actual thing
    using the general thing as a guide. When you instantiate a class, you add arguments that
    will determine what makes your instances of the class special. See how 'Chef' is a class,
    and then we instantiate two individual chefs, one who likes pizza and one who likes clam
    chowder? We've written our class so that the object representing a chef always does one thing: cook.
    But each individual chef cooks what they like best.
    """
    def __init__(
        self, order=20, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)

class PrepareForOpenAI(Step):
    name = "Prepare for OpenAI"
    code = """
import openai
from openai import ChatCompletion

openai.api_key = "<add your API key here>"
"""
    instructions = """
    We're going to be using a library called OpenAI in the next few steps. A library is a collection of code that someone else has written that we can use in our own code. In this case, OpenAI is a library that lets us use the GPT-3 language model.

    Before we can use the library we need to get an API key. An API key is a way of identifying ourselves to OpenAI so that they know who is using their service. To get an API key, go to https://platform.openai.com/ and sign up for an account. Once you've signed up, go to https://platform.openai.com/account/api-keys and copy your API key. Then, paste it into the code editor in place of the text that says "<add your API key here>".
    """

    questions = ["Should I share my API key with other people?"]

    def __init__(
        self, order=21, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)


class GPTRecipeMaker(Step):
    # Need to add something to explain why we dont go into how LLMs work; i have a feeling people might have been expecting that
    # answer is just that it would be insane to try to get into in an intro to programming course
    name = "Order Up!"
    code = """
import openai
from openai import ChatCompletion

def create_recipe(toppings, size):
    recipe = "Make a " + size + " pizza with "
    for topping in toppings:
        recipe += topping + ", "
    return recipe

openai.api_key = "<add your API key here>"
toppings = ["pepperoni", "mushrooms", "sausage"]
recipe_instructions = create_recipe(toppings, size)
chat_completion = ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user",
        "content": recipe_instructions}
    ])
print(chat_completion.choices[0].message.content)
    """
    instructions = """We've come quite a ways from the introduction to variables.
    You've made it to the very end of our introduction to Python! Consider yourself
    high-fived. The grand finale awaits; we're going to use OpenAI's Python library
    to get a prediction from ChatGPT. This lesson is going to use just about every
    programming concept we've studied so far. Take a look at the code in the editor;
    at first glance, this code might look more complicated than what we've been doing
    so far. If you spend a bit more time reading it over, you should see plenty of
    familiar code; executing a method on a class that takes a string, a list containing
    a dictionary, and then indexing into the result of the call to the method. And if
    you don't understand any of these lines -- you know who to ask.
    
    There are two things that you shouldn't expect to understand yet:
        1. how the `ChatCompletion.create` method works
        2. how a method can access information somewhere else the internet
    
    Part of programming is getting used to feeling confused. But if you stick with it,
    things will, bit by bit, start to fall into place. If you've made it this far, we
    expect you'll be back for more!
    """
    def __init__(
        self, order=21, name=name, code=code, instructions=instructions, questions=[]
    ):
        super().__init__(order, name, code, instructions, questions)