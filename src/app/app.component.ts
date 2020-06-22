import { Component, VERSION, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { fromEvent, interval, Subscription } from "rxjs";
import { takeUntil, take, startWith, map } from "rxjs/operators";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  timerForm: FormGroup;
  hours;
  minutes;
  seconds;
  h;
  m;
  s;
  totalSeconds;
  isShow = true;
  source;

  timeShow = null;
  subScription: Subscription;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.loadSessionTimerForm();
  }

  ngOnDestroy() {
    this.subScription.unsubscribe();
  }

  loadSessionTimerForm() {
    this.timerForm = this.fb.group({
      firstDigit: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)]
      ],
      secondDigit: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)]
      ],
      thirdDigit: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)]
      ],
      fourthDigit: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)]
      ],
      fifthDigit: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)]
      ],
      sixthDigit: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)]
      ]
    });
  }

  // Handle Reverse timer
  onSubmitStartTimer() {
    this.isShow = !this.isShow;

    this.hours = `${this.timerForm.get("firstDigit").value}${
      this.timerForm.get("secondDigit").value
    }`;
    this.minutes = `${this.timerForm.get("thirdDigit").value}${
      this.timerForm.get("fourthDigit").value
    }`;
    this.seconds = `${this.timerForm.get("fifthDigit").value}${
      this.timerForm.get("sixthDigit").value
    }`;

    this.h = this.hours * 3600;
    this.m = this.minutes * 60;
    this.s = this.seconds * 1;

    this.totalSeconds = this.h + this.m + this.s;

    console.log("Total Seconds", this.totalSeconds);

    this.source = interval(1000).pipe(
      map(i => this.totalSeconds - i - 1),
      take(this.totalSeconds),
      startWith(this.totalSeconds)
    );

    this.subScription = this.source.subscribe(x => {
      this.timeShow = this.secondsToHms(x);
      console.log(this.timeShow);

      this.timerForm.get("firstDigit").setValue(this.timeShow.hours[0]);
      this.timerForm.get("firstDigit").disable();
      this.timerForm.get("secondDigit").setValue(this.timeShow.hours[1]);
      this.timerForm.get("secondDigit").disable();
      this.timerForm.get("thirdDigit").setValue(this.timeShow.minutes[0]);
      this.timerForm.get("thirdDigit").disable();
      this.timerForm.get("fourthDigit").setValue(this.timeShow.minutes[1]);
      this.timerForm.get("fourthDigit").disable();
      this.timerForm.get("fifthDigit").setValue(this.timeShow.seconds[0]);
      this.timerForm.get("fifthDigit").disable();
      this.timerForm.get("sixthDigit").setValue(this.timeShow.seconds[1]);
      this.timerForm.get("sixthDigit").disable();
    });
  }

  restartStartTimer() {
    this.isShow = !this.isShow;

    this.subScription.unsubscribe();
    this.timerForm.get("firstDigit").enable();
    this.timerForm.get("secondDigit").enable();
    this.timerForm.get("thirdDigit").enable();
    this.timerForm.get("fourthDigit").enable();
    this.timerForm.get("fifthDigit").enable();
    this.timerForm.get("sixthDigit").enable();
  }

  // Focus next field in the session timer
  tabChange(val, event?): void {
    const regEx = /^[0-9]*$/;
    const ele: any = document.querySelectorAll(".digit");
    ele[val].focus();
    if (regEx.test(event.target.value)) {
      const ele: any = document.querySelectorAll(".digit");
      console.log("EVENTS => ", event);
      if (ele[val - 1].value !== "") {
        ele[val] ? ele[val].focus() : ele[val - 1].focus();
      } else if (ele[val - 1].value === "") {
        ele[val - 2] ? ele[val - 2].focus() : ele[val - 1].focus();
      }
    } else {
      event.target.value = "";
    }
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? (h > 9 ? h : "0" + h) : "00";
    var mDisplay = m > 0 ? (m > 9 ? m : "0" + m) : "00";
    var sDisplay = s > 0 ? (s > 9 ? s : "0" + s) : "00";
    return {
      hours: hDisplay + "",
      minutes: mDisplay + "",
      seconds: sDisplay + ""
    };
  }
}
