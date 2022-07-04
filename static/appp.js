let $word_input = $("#word");
let words_array = [];
let form = $("#submit-form");

$("#submit-form").hide();

$("#start").on("click", function () {
  $("#submit-form").show();
  console.log("start clicked");
  setTimeout(game_round, 60000);
  $("#score-title").text("Score: 0");
  $(".words").empty();
});

function game_round() {
  // $("#words")== "";
  alert("Game Over. Start a new Game!");
  $("#submit-form").hide();
}

$("#submit-form").on("submit", function (e) {
  e.preventDefault();

  let word = $word_input.val();
  console.log(word);

  if (!word) {
    alert("Please submit a word");
  }

  // if (!game_round) {
  //   alert(`You must click, "Start Game"`);
  //   return;
  // }

  async function grab_input() {
    const response = await axios.get("/submit-guess", {
      params: { word: word },
    });
    console.log(response);
    if (response.data.result == "ok" && response.data.result != response.data) {
      showMessage(word, "is a great word!");
      words_array.push(word);
      console.log(words_array);
      word_length = word.length;
      console.log(word_length);
      postScore(word, word_length, words_array);
    } else if (response.data.result == "not-on-board") {
      showMessage(word, "is not on the board!");
    } else {
      showMessage(word, "is not a word!");
    }

    $word_input.val("");
  }
  grab_input();

  function showMessage(word, message) {
    sentence = `${word}, ${message}`;
    console.log(sentence);
    $(".msg").append(sentence);
    setTimeout(delete_message, 3000);
  }

  function delete_message() {
    $(".msg").empty();
  }

  function reset() {}
  // the match/ logic is wrong, but when I console.log it the output for tota l is right..?
  function postScore(word, word_length, words_array) {
    console.log(word);

    let html_mark_up = `<li> ${word} - ${word_length} points`;
    $(".words").append(html_mark_up);

    let total = 0;
    for (word_used in words_array) {
      total += word.length;
      console.log(total);

      $("#score-title").empty();
      $("#score-title").append(`Total Score: ${total}`);

      // }

      async function scoreGame() {
        score = total;
        console.log(score);
        // $(".add-word", this.board).hide();
        let resp = await axios.post("/post-score", { score: score });
        if (resp.data.brokeRecord) {
          scoreMessage(`New record: ${score}`, "ok");
        } else {
          scoreMessage(`Final score: ${score}`, "ok");
        }
      }
      scoreGame();
    }
  }

  function scoreMessage(message, status) {
    console.log("Score method");
    $(".msg").append(`${message}`);
    setTimeout(delete_message, 500);
  }
});
