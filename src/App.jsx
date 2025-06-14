import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import "./index.css";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [feedbackEntries, setFeedbackEntries] = useState([]);

  const ratingDescription = {
    1: "Poor",
    2: "Bad",
    3: "Average",
    4: "Good",
    5: "Excellent",
  };

  useEffect(() => {
    const savedFeedbacks = localStorage.getItem("feedbackEntries");
    if (savedFeedbacks) {
      setFeedbackEntries(JSON.parse(savedFeedbacks));
    }
  }, []);

  const averageRating =
    feedbackEntries.length > 0
      ? (
          feedbackEntries.reduce((sum, entry) => sum + entry.rating, 0) /
          feedbackEntries.length
        ).toFixed(1)
      : 0;

  function handleRating(value) {
    setRating(value);
    setSuccess(false);
  }

  function handleTextArea(e) {
    setText(e.target.value);
    setSuccess(false);
  }

  function handleDisabledForm() {
    setError("");
    setSuccess(false);
    setRating(0);
    setText("");
  }

  function handleDeleteEntry(id) {
    const updatedList = feedbackEntries.filter((item) => item.id !== id);
    setFeedbackEntries(updatedList);

    localStorage.setItem("feedbackEntries", JSON.stringify(updatedList));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (rating === 0 || text.trim() === "") {
      setError("Please provide a valid rating and a comment");
      setSuccess(false);
      return;
    }

    const now = new Date();
    const formattedDateTime = format(now, "hh:mm a, do MMMM yyyy");

    const newEntry = {
      id: `${now.getTime()}`,
      rating: rating,
      comment: text,
      date: formattedDateTime,
    };

    const updatedFeedbacks = [newEntry, ...feedbackEntries];
    setFeedbackEntries(updatedFeedbacks);

    localStorage.setItem("feedbackEntries", JSON.stringify(updatedFeedbacks));

    setError("");
    setSuccess(true);
    setRating(0);
    setText("");
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Feedback Form</h1>
      </div>
      <div className="form-body">
        <div className="rating">
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.3rem",
                  marginTop: 0,
                  marginBottom: "15px",
                }}
              >
                Submit a feedback
              </p>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    color: rating >= star ? "gold" : "gray",
                    fontSize: "45px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
              {rating > 0 ? (
                <p>{ratingDescription[rating]}</p>
              ) : (
                <p>No rating yet</p>
              )}
            </div>

            <textarea
              placeholder="enter feedback here"
              value={text}
              onChange={handleTextArea}
            />
            <br />
            <button disabled={rating === 0 || text.trim() === ""}>
              Submit
            </button>

            {error && <p>{error}</p>}
            {success && (
              <p style={{ textAlign: "center" }}>
                Submitted successfully,{" "}
                <a href="#" onClick={handleDisabledForm}>
                  submit another response
                </a>
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="feedback-area">
        <div className="feedback">
          {feedbackEntries.length > 0 ? (
            <>
              <p>Your feedback entries</p>
              <ul>
                {feedbackEntries.map((item) => (
                  <li key={item.id} className="entries">
                    <div className="entry-content">
                    <span>
                      Rating: {item.rating}
                      <span style={{color:'yellow', fontSize: '17px'}}> ★</span> <br />
                      {ratingDescription[item.rating]}
                    </span>

                    <span className="comment"
                    >
                      Comment: {item.comment}
                    </span>
                    <br />

                    <span>{item.date}</span>
                    <span
                      className="delete"
                      onClick={() => handleDeleteEntry(item.id)}
                      style={{
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <span>No feedback yet</span>
          )}
        </div>

        <div
          className="average"
          style={{
            textAlign: "center",
          }}
        >
          {feedbackEntries.length > 0 && (
            <span>
              Average Rating:
              <p>{averageRating} </p>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
