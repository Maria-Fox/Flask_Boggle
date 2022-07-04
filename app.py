from crypt import methods
from urllib import response
from flask import Flask, Response, jsonify, make_response, redirect, render_template, session, request, redirect
import flask
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle
from random import choice
import string

# session[key] = value
board_key = "items"
words_submitted_key = "words"

app = Flask (__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

debug = DebugToolbarExtension(app)

# substantiate a Boggle class
boggle_game = Boggle()
# board_return = boggle_game.make_board()

# Currently working on the same board. When I request new board upon route being used the conditionals don't work.
@app.route("/home") 
def make_board_function():
  board_return = boggle_game.make_board()
  items= board_return
  session["board_key"] = items

  return render_template("index.html", board = board_return, items=items)

# get request to grab the input and the words.txt file and compare if input is in the file

@app.route("/submit-guess", methods = ["GET"])
def grab_input():
    board_return = boggle_game.make_board()

    # word = request.args['word'] 
    word = request.args.get("word")

    # Storing the values submitting in session
    session["words_key"] = []
    words_added = session["words_key"]
    words_added.append(word)
    session["words_key"] = words_added
  
    response= boggle_game.check_valid_word(board_return, word)

    return jsonify({"result" : response})

  
# GO BACK AND PASS IN THE VARIABLE SCORE AS THE PARAMETER <>
@app.route("/post-score", methods=["POST"])
def post_score():

    # i think it's this but unsure. How do Igrab the score value? 
    score = request.args["score"]
    

    session["score"] = []
    list = session["score"]
    list.append(score)
    session[score]=list

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)
