const plannerData = {
  example: {
    schedule: [
      {
        timeblock: [
          {
            start: 0,
            finish: 5,
            id: 0,
            color: "red",
            plan: [],
          },
          {
            start: 163,
            finish: 172,
            id: 1,
            color: "blue",
            plan: [],
          },
          {
            start: 190,
            finish: 215,
            id: 2,
            color: "purple",
            plan: [],
          },
          {
            start: 230,
            finish: 235,
            id: 3,
            color: "red",
            plan: [],
          },
        ],
      },
    ],
    plan: [],
  },
  planlist: {
    20220901: {
      date: "20220901",
      subject: {
        수학: {
          plan: [
            {
              subject: "수학",
              content: "ㅇㅇ하기",
              type: "timer",
              state: "none",
              id: 0,
            },
          ],
          time: 0,
        },
      },
      schedule: {
        timeblock: [
          {
            start: 0,
            finish: 10,
            id: 0,
            plan: [
              {
                id: 0,
              },
            ],
          },
        ],
      },
    },
  },
  daily: {
    subject: {
      0: ["수학", "생명"],
      1: ["수학", "영어"],
      2: ["수학", "국어"],
      3: ["수학", "화학"],
      4: ["국어", "영어"],
      5: ["수학", "생명"],
      6: ["수학", "화학"],
    },
  },
  color: {
    수학: "red",
    영어: "blue",
  },
};

const date = new Date();
const todayJson = {
  year: parseInt(date.getFullYear()),
  date: parseInt(date.getDate()),
  day: parseInt(date.getDay()),
  month: date.getMonth() + 1,
};

function save() {}

class Plan {
  constructor({ dateJson, data }) {
    this.dateJson = dateJson;
    this.plan = {};
    this.currentId = data?.planId | 0;
    this.currentSchId = data?.schId | 0;
  }
  get dateStr() {
    let { year, date, month } = this.dateJson;

    date = date < 10 ? "0" + date : date;
    month = month < 10 ? "0" + month : month;

    let str = "" + year + month + date;

    return str;
  }
  get schedule() {
    return this.plan.schedule;
  }

  init() {
    if (!plannerData.planlist[this.dateStr]) this.makePlan(this.dateStr, this.dateJson);
  }

  drawPlan() {
    const list = plannerData.planlist[this.dateStr];
    const mainContainer = document.querySelector("#plan-main-container");
    mainContainer.innerHTML = "";
    console.log(list);
    Object.keys(list.subject).forEach((name, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
            <h2 class="accordion-header" id="heading-1">
                <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse-${index}"
                    aria-expanded="false"
                >
                    ${name}
                </button>
            </h2>
            <div id="collapse-${index}" class="show accordion-collapse collapse" data-bs-parent="#accordion-example">
                <div class="accordion-body pt-0">
                    <div class="detail-list list-group" style="overflow: auto; height: 100%">
                    </div>
                </div>
            </div>
          `;
      const container = div.querySelector(".detail-list");
      list.subject[name].plan.forEach((plan) => {
        const planDiv = document.createElement("div");
        planDiv.classList = "list-group-item";
        planDiv.textContent = plan.content;
        container.append(planDiv);
      });

      mainContainer.append(div);
      console.log(list, name, list.subject[name].plan);
    });
  }

  makePlan() {
    const result = {
      date: { dateStr: this.dateStr, dateJson: this.dateJson },
      subject: {},
      schedule: {
        timeblock: [],
      },
    };

    result.schedule.timeblock = plannerData.example.schedule[0].timeblock;
    // for (let i = 0; i < 24; i++) {
    //   result.schedule.timeblock.push({
    //     start: i * 10,
    //     finish: i * 10 + 6,
    //     id: this.currentSchId++,
    //     plan: [],
    //   });
    // }

    plannerData.daily.subject[this.dateJson.day - 1].forEach((el) => {
      result.subject[el] = {
        plan: [],
        time: 0,
      };
    });

    this.plan = { ...result };
    this.save();
    console.log(result);
    return { ...result };
  }
  save() {
    plannerData.planlist[this.dateStr] = { ...this.plan };
    this.drawPlan();
    this.drawSchedule();
  }

  addSubject(name) {
    if (this.plan.subject[name]) return;
    this.plan.subject[name] = {
      plan: [{ subject, content, type: "timer", state: "none", id: this.currentId++ }],
      time: 0,
    };
    this.save();
  }
  deleteSubject(name) {}

  addDetail(subject, content) {
    this.plan.subject[subject].plan.push({
      subject,
      content,
      type: "timer",
      state: "none",
      id: this.currentId++,
    });
    this.save();
  }
  deleteDetail(subject, id) {
    for (let i = 0; i < this.plan.subject[subject].plan.length; i++) {
      if (this.plan.subject[subject].plan[i].id == id) {
        this.plan.subject[subject].plan.splice(i, 1);
        break;
      }
    }
    this.save();
  }
  changeDetail(subject, id, content) {
    for (let i = 0; i < this.plan.subject[subject].plan.length; i++) {
      if (this.plan.subject[subject].plan[i].id == id) {
        this.plan.subject[subject].plan[i].content = content;
        break;
      }
    }
    this.save();
  }
  changeDetailState(subject, id, state) {
    for (let i = 0; i < this.plan.subject[subject].plan.length; i++) {
      if (this.plan.subject[subject].plan[i].id == id) {
        this.plan.subject[subject].plan[i].state = state;
        break;
      }
    }
    this.save();
  }

  deleteTimeblock(id) {
    for (let i = 0; i < this.schedule.timeblock.length; i++) {
      if (this.schedule.timeblock[i].id == id) {
        this.schedule.timeblock.splice(i, 1);
        break;
      }
    }
    this.save();
  }
  addTimeblock(start, finish, color = "grey") {
    this.schedule.timeblock.push({
      start,
      finish,
      id: this.currentSchId++,
      color,
      plan: [],
    });
  }
  changeTimeblockRange(id, { start, finish }) {
    for (let i = 0; i < this.schedule.timeblock.length; i++) {
      if (this.schedule.timeblock[i].id == id) {
        this.schedule.timeblock[i].start = start;
        this.schedule.timeblock[i].finish = finish;

        for (let j = 0; j < this.schedule.timeblock.length; j++) {
          if (i == j) continue;

          if (this.schedule.timeblock[j].finish < finish) {
            if (this.schedule.timeblock[j].finish <= start) continue;
            else if (this.schedule.timeblock[j].finish > start && this.schedule.timeblock[j].start < start) {
              this.schedule.timeblock[j].finish = start;
              continue;
            } else if (this.schedule.timeblock[j].start >= start) {
              this.schedule.timeblock.splice(j, 1);
              if (i > j) {
                i--, j--;
              } else {
                j--;
              }
              continue;
            }
          } else if (this.schedule.timeblock[j].finish >= finish && this.schedule.timeblock[j].start < finish) {
            this.schedule.timeblock[j].start = finish;
            continue;
          } else continue;
        }
        break;
      }
    }
    this.save();
  }
  drawSchedule() {
    this.schedule.timeblock.forEach((block) => {
      const { start, finish } = { ...block };
      console.log(block);
      const blocks = document.querySelectorAll(".time-block");
      blocks.forEach((el) => {
        console.log(el.dataset.number);
        if (el.dataset.number >= start && el.dataset.number <= finish) {
          el.dataset.blockId = block.id;
          el.style.backgroundColor = block.color;
        }
      });
    });
  }
  addDetailToTimeBlock(blockId, detailId) {
    console.log(this.findTimeblockById(blockId));
    this.findTimeblockById(blockId).plan.push(detailId);
  }

  findTimeblockById(id) {
    for (let i = 0; i < this.schedule.timeblock.length; i++) {
      if (this.schedule.timeblock[i].id == id) {
        return this.schedule.timeblock[i];
      }
    }
  }
  findDetailById(id) {
    console.time("hi");
    for (let j = 0; j < Object.values(this.plan.subject).length; j++) {
      console.log(Object.values(this.plan.subject)[j]);
      for (let i = 0; i < Object.values(this.plan.subject)[j].plan.length; i++) {
        if (Object.values(this.plan.subject)[j].plan[i].id == id) {
          console.timeEnd("hi");
          return Object.values(this.plan.subject)[j].plan[i];
        }
      }
    }
  }
}

let currentPlan;
window.onload = function () {
  currentPlan = new Plan({ dateJson: todayJson });
  currentPlan.init();

  document.querySelector(".plan-form").addEventListener("submit", (el) => {
    el.preventDefault();
    currentPlan.addDetail(el.target.subject.value, el.target.detail.value);
    el.target.detail.value = "";
  });
};
