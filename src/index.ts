interface Feedback {
  id: number;
  comment: string;
  score: number;
}

class FeedbackMenu {
  private feedbackList: Feedback[] = [];

  constructor() {
    this.loadFeedbacks();
    this.renderFeedback();
  }

  private saveFeedbacks(): void {
    localStorage.setItem("feedbackList", JSON.stringify(this.feedbackList));
  }

  private loadFeedbacks(): void {
    const savedFeedbacks = localStorage.getItem("feedbackList");
    if (savedFeedbacks) {
      this.feedbackList = JSON.parse(savedFeedbacks);
    }
  }

  renderFeedback(): void {
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

  createFeedback(newFeedback: Feedback): void {
    this.feedbackList.push(newFeedback);
    this.saveFeedbacks();
    this.renderFeedback();
  }

  updateFeedback(id: number, updatedFeedback: Feedback): void {
    const index = this.feedbackList.findIndex((feedback) => feedback.id === id);
    if (index !== -1) {
      this.feedbackList[index] = updatedFeedback;
      this.saveFeedbacks();
      this.renderFeedback();
      console.log("Xoá thành công");
    } else {
      console.log("Không tìm thấy bình luận.");
    }
  }

  deleteFeedback(id: number): void {
    const index = this.feedbackList.findIndex((feedback) => feedback.id === id);
    if (index !== -1) {
      this.feedbackList.splice(index, 1);
      this.saveFeedbacks();
      this.renderFeedback();
      console.log("Xoá thành công");
    } else {
      console.log("Không tìm thấy bình luận.");
    }
  }

  getFeedbackById(id: number): Feedback | undefined {
    return this.feedbackList.find((feedback) => feedback.id === id);
  }
}

const feedbackMenu = new FeedbackMenu();

function addFeedback(): void {
  const inputElement = document.getElementById(
    "feedbackInput"
  ) as HTMLInputElement;
  const inputValue = inputElement.value;
  if (inputValue && selectedScore !== null) {
    const newFeedback: Feedback = {
      id: Date.now(),
      comment: inputValue,
      score: selectedScore,
    };
    feedbackMenu.createFeedback(newFeedback);
    inputElement.value = "";
    resetSelectedScore();
  } else {
    alert("Chọn điểm và viết bình luận");
  }
}

function editFeedback(id: number): void {
  const feedback = feedbackMenu.getFeedbackById(id);
  if (feedback) {
    const inputElement = document.getElementById(
      "feedbackInput"
    ) as HTMLInputElement;
    inputElement.value = feedback.comment;
    selectedScore = feedback.score;
    updateSelectedCell();
    const sendButton = document.getElementById(
      "sendButton"
    ) as HTMLButtonElement;
    sendButton.textContent = "Update";
    sendButton.onclick = () => updateFeedback(id);
  }
}

function updateFeedback(id: number): void {
  const inputElement = document.getElementById(
    "feedbackInput"
  ) as HTMLInputElement;
  const updatedComment = inputElement.value;
  if (updatedComment && selectedScore !== null) {
    const updatedFeedback: Feedback = {
      id: id,
      comment: updatedComment,
      score: selectedScore,
    };
    feedbackMenu.updateFeedback(id, updatedFeedback);
    inputElement.value = "";
    resetSelectedScore();
    const sendButton = document.getElementById(
      "sendButton"
    ) as HTMLButtonElement;
    sendButton.textContent = "Send";
    sendButton.onclick = addFeedback;
  } else {
    alert("Chọn điểm và viết bình luận");
  }
}

function deleteFeedback(id: number): void {
  if (confirm("Bạn có chắc muốn xoá không?")) {
    feedbackMenu.deleteFeedback(id);
  }
}

let selectedCell: HTMLElement | null = null;
let selectedScore: number | null = null;

function toggleColor(cell: HTMLElement, score: number): void {
  if (selectedCell) {
    selectedCell.classList.remove("selected");
  }
  cell.classList.add("selected");
  selectedCell = cell;
  selectedScore = score;
}

function resetSelectedScore(): void {
  selectedScore = null;
  updateSelectedCell();
}

function updateSelectedCell(): void {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const score = parseInt(cell.textContent || "0");
    if (score === selectedScore) {
      cell.classList.add("selected");
    } else {
      cell.classList.remove("selected");
    }
  });
}
