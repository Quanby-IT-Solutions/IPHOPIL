import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';


@Component({
  selector: 'app-lottie-animation',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './lottie-animation.component.html',
  styleUrl: './lottie-animation.component.css'
})
export class LottieAnimationComponent implements OnChanges {

  @Input() class = '';
  @Input() animation = '';
  @Input() loop = true;

  options: AnimationOptions = {
    path: `/assets/animations/loader.json`,
    loop: true,
    autoplay: true
  };

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['animation']){
      this.options = {
        path: `/assets/animations/${this.animation}.json`,
        loop: this.loop,
        autoplay: true
      }
    }
  }
}


