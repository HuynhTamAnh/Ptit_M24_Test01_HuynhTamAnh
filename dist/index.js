"use strict";
class FeedbackMenu {
    constructor() {
        this.feedbackList = [];
        this.loadFeedbacks();
        this.renderFeedback();
    }
    saveFeedbacks() {
        localStorage.setItem("feedbackList", JSON.stringify(this.feedbackList));
    }
    loadFeedbacks() {
        const savedFeedbacks = localStorage.getItem("feedbackList");
        if (savedFeedbacks) {
            this.feedbackList = JSON.parse(savedFeedbacks);
        }
    }
    renderFeedback() {
        const feedbackListElement = document.getElementById("feedbackList");
        if (feedbackListElement) {
            feedbackListElement.innerHTML = ""; // Clear current feedback items
            this.feedbackList.forEach((feedback) => {
                const feedbackItem = document.createElement("div");
                feedbackItem.className = "feedback-item";
                feedbackItem.innerHTML = `
          ID: ${feedback.id}, Comment: ${feedback.comment}, Score: ${feedback.score}
          <button class="edit-button" onclick="editFeedback(${feedback.id})">Edit</button>
          <button onclick="deleteFeedback(${feedback.id})">Delete</button>
        `;
                feedbackListElement.appendChild(feedbackItem);
            });
        }
    }
    createFeedback(newFeedback) {
        this.feedbackList.push(newFeedback);
        this.saveFeedbacks();
        this.renderFeedback();
    }
    updateFeedback(id, updatedFeedback) {
        const index = this.feedbackList.findIndex((feedback) => feedback.id === id);
        if (index !== -1) {
            this.feedbackList[index] = updatedFeedback;
            this.saveFeedbacks();
            this.renderFeedback();
            console.log("Xoá thành công");
        }
        else {
            console.log("Không tìm thấy bình luận.");
        }
    }
    deleteFeedback(id) {
        const index = this.feedbackList.findIndex((feedback) => feedback.id === id);
        if (index !== -1) {
            this.feedbackList.splice(index, 1);
            this.saveFeedbacks();
            this.renderFeedback();
            console.log("Xoá thành công");
        }
        else {
            console.log("Không tìm thấy bình luận.");
        }
    }
    getFeedbackById(id) {
        return this.feedbackList.find((feedback) => feedback.id === id);
    }
}
const feedbackMenu = new FeedbackMenu();
function addFeedback() {
    const inputElement = document.getElementById("feedbackInput");
    const inputValue = inputElement.value;
    if (inputValue && selectedScore !== null) {
        const newFeedback = {
            id: Date.now(),
            comment: inputValue,
            score: selectedScore,
        };
        feedbackMenu.createFeedback(newFeedback);
        inputElement.value = "";
        resetSelectedScore();
    }
    else {
        alert("Chọn điểm và viết bình luận");
    }
}
function editFeedback(id) {
    const feedback = feedbackMenu.getFeedbackById(id);
    if (feedback) {
        const inputElement = document.getElementById("feedbackInput");
        inputElement.value = feedback.comment;
        selectedScore = feedback.score;
        updateSelectedCell();
        const sendButton = document.getElementById("sendButton");
        sendButton.textContent = "Update";
        sendButton.onclick = () => updateFeedback(id);
    }
}
function updateFeedback(id) {
    const inputElement = document.getElementById("feedbackInput");
    const updatedComment = inputElement.value;
    if (updatedComment && selectedScore !== null) {
        const updatedFeedback = {
            id: id,
            comment: updatedComment,
            score: selectedScore,
        };
        feedbackMenu.updateFeedback(id, updatedFeedback);
        inputElement.value = "";
        resetSelectedScore();
        const sendButton = document.getElementById("sendButton");
        sendButton.textContent = "Send";
        sendButton.onclick = addFeedback;
    }
    else {
        alert("Chọn điểm và viết bình luận");
    }
}
function deleteFeedback(id) {
    if (confirm("Bạn có chắc muốn xoá không?")) {
        feedbackMenu.deleteFeedback(id);
    }
}
let selectedCell = null;
let selectedScore = null;
function toggleColor(cell, score) {
    if (selectedCell) {
        selectedCell.classList.remove("selected");
    }
    cell.classList.add("selected");
    selectedCell = cell;
    selectedScore = score;
}
function resetSelectedScore() {
    selectedScore = null;
    updateSelectedCell();
}
function updateSelectedCell() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        const score = parseInt(cell.textContent || "0");
        if (score === selectedScore) {
            cell.classList.add("selected");
        }
        else {
            cell.classList.remove("selected");
        }
    });
}
