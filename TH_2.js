document.addEventListener(
  "DOMContentLoaded",
  function () {
    // your code here
    document.getElementById("btn_add").addEventListener("click", addNewTask);
    loadListTask();
  },
  false
);
function addNewTask() {
  var str_title = document.getElementById("txt_title").value;
  var str_content = document.getElementById("txt_content").value;
  var task = {
    id: 0,
    title: str_title,
    content: str_content,
    status: 0,
  };
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 201) {
      alert("Thêm công việc thành công");
      loadListTask();
      document.getElementById("txt_title").value = "";
      document.getElementById("txt_content").value = "";
    }
  };
  xhttp.open(
    "POST",
    "http://207.148.70.40:43741/todolist1-1.0-SNAPSHOT/webresources/task",
    true
  );
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(task));
}
function loadListTask() {
  console.log("load");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    console.log(this.responseText);
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var arr = JSON.parse(this.responseText);
      var list_container = document.getElementById("list");
      list_container.innerHTML = ""; //xóa list cũ để load list mới
      for (var i = 0; i < arr.length; i++) {
        list_container.appendChild(task_to_html_item(arr[i]));
      }
    }
  };
  xhttp.open(
    "GET",
    "http://207.148.70.40:43741/todolist1-1.0-SNAPSHOT/webresources/task/all",
    true
  );
  xhttp.send();
}

function task_to_html_item(task) {
  var item_tag = document.createElement("div");
  var title_tag = document.createElement("h3");
  title_tag.innerText = task.title;
  item_tag.appendChild(title_tag);
  var content_tag = document.createElement("p");
  content_tag.innerText = task.content;
  item_tag.appendChild(content_tag);
  var button_container_tag = document.createElement("div");
  if (task.status == 0) {
    var button_check = document.createElement("button");
    button_check.innerText = "Check";
    button_check.setAttribute("data-id", task.id); //chỉ thực hiện được trên HTML5
    button_check.setAttribute("data-title", task.title);
    button_check.setAttribute("data-content", task.content);
    button_check.addEventListener("click", function () {
      var task_id = this.getAttribute("data-id");
      var task_check = {
        id: task_id,
        title: this.getAttribute("data-title"),
        content: this.getAttribute("data-content"),
        status: 1,
      };
      updateTask(task_check);
    });
    button_container_tag.appendChild(button_check);
  }
  var button_delete = document.createElement("button");
  button_delete.innerText = "Delete";
  button_delete.setAttribute("data-id", task.id); //chỉ thực hiện được trên HTML5
  button_delete.addEventListener("click", function () {
    var task_id = this.getAttribute("data-id");
    deleteTask(task_id);
  });
  button_container_tag.appendChild(button_delete);
  item_tag.appendChild(button_container_tag);
  item_tag.classList.add("artical");
  return item_tag;
}
function updateTask(task) {
  task.status = 1;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 303) {
      alert("Cập nhật công việc thành công");
      loadListTask();
    }
  };
  xhttp.open(
    "PUT",
    "http://207.148.70.40:43741/todolist1-1.0-SNAPSHOT/webresources/task/" +
      task.id,
    true
  );
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(task));
}
function deleteTask(taskid) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 204) {
      alert("Xóa công việc thành công");
      loadListTask();
    }
  };
  xhttp.open(
    "DELETE",
    "http://207.148.70.40:43741/todolist1-1.0-SNAPSHOT/webresources/task/" +
      taskid,
    true
  );
  xhttp.send();
}
