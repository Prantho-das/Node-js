let roomidnumber;
var userlist = [];
var sender_id=null;
let socket = io("http://localhost:5000");
const scroll = () => {
  setTimeout(() => {
    let chatarea = document.querySelector(".chatarea");
    chatarea.scrollTo(0, chatarea.scrollHeight);
  }, 150);
};
socket.on("new_message", (data) => {
  if (data.chat_id === roomidnumber) {
    let chatarea = document.querySelector(".chatarea");
    chatarea.insertAdjacentHTML("beforeend", message(data));
    scroll();
  }
});
socket.on("new_user", (data) => {
  const userishere = userlist.filter((user) => {
    user.id === data.id;
  });
  if (userishere.length > 0) {
    let list = document.querySelector(".activeuserlist");
    userlist.push(...userishere);
    list.insertAdjacentHTML("afterend", new_user(data));
  }
});
document.addEventListener("alpine:init", () => {
  Alpine.data("chat", () => ({
    msg: "",
    sender_id: 0,
    receiver_id: 0,
    room_id: 0,
    message: [],
    activeuser: [],
    receiver_set(id) {
      this.receiver_id = id;
      this.room();
      scroll();
    },
    init() {
      this.sender_id = parseInt(this.$refs.sender.value);
      sender_id=this.sender_id
      this.activeuserlist();
    },
    room() {
      fetch("http://localhost:5000/dashboard/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: this.receiver_id,
          sender_id: this.sender_id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          this.room_id = result.roomidnumber;
          this.message = [...result.message];
          roomidnumber = parseInt(result.roomidnumber);
        })
        .catch((e) => console.log(e));
    },
    activeuserlist() {
      fetch("http://localhost:5000/dashboard/user")
        .then((res) => res.json())
        .then((result) => {
          this.activeuser = [...result];
          userlist = [...result];
        })
        .catch((e) => console.log(e));
    },
    messagesend() {
      fetch("http://localhost:5000/dashboard/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: this.receiver_id,
          sender_id: this.sender_id,
          room_id: this.room_id,
          message: this.msg.trim(),
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((e) => console.log(e));
         this.msg = "";
    },
  }));
  console.log(this.room_id);
});
const new_user = (data) => {
  return `<li
            class="
              list-group-item
              shadow-sm
              d-flex
              px-3
              pointer
              text-capitalize
              justify-content-between
              align-items-center
              mb-3
            "
            role="button"
           @click="receiver_set(${data.id})"
          >
          <img
            x-bind:src='"https://ui-avatars.com/api/?name=${data.first_name}&color=7F9CF5&background=EBF4FF"'
              class="rounded-circle w-auto d-block"
              alt=""
              style="width: 3rem;height:3rem;"
            />
          <h5 class="text-secondary" x-text='"${data.first_name} ${data.last_name}"'></h5>
          </li>`;
};
const message = (data) => {
  console.warn(data)
  return `<li
            class="
              list-group-item
              shadow-sm
              d-flex
              px-4
              pointer
              text-capitalize
              justify-content-between
              align-items-center
            "
            role="button"
          >
            <img
              src="https://ui-avatars.com/api/?name=${data.first_name}&color=7F9CF5&background=EBF4FF"
              class="rounded-circle w-auto d-block"
              alt=""
            />
            <h3 class="${data.sender_id!=sender_id?'text-success':'text-primary'}">${data.message}</h3>
          </li>
          `;
};
