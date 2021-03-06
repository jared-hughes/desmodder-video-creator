import { DCGView } from "desmodder";
import "./LoadingPie.less";

export default class LoadingPie extends DCGView.Class<{
  // progress 0 to 1 when not pending
  progress: number;
  // if true, just pulse
  isPending: boolean;
}> {
  template() {
    return (
      <div class="video-creator-pie-container">
        <div
          class={() => ({
            "video-creator-centered-pie": true,
            "video-creator-pending": this.props.isPending(),
          })}
        >
          <div class="video-creator-base-circle" />
          {/*
            SVG can't be used directly as DCGView element because of SVG namespace
            reasons, and treating it as an HTMLElement causes it to be ignored
            by the browser. Instead, set innerHTML.
          */}
          <div
            onMount={this.setSVG.bind(this)}
            didUpdate={this.setSVG.bind(this)}
          />
        </div>
      </div>
    );
  }

  setSVG(e: HTMLElement) {
    const progress = this.props.progress();
    // similar to React's dangerouslySetInnerHTML
    e.innerHTML =
      0 <= progress && progress <= 1
        ? `<svg class='video-creator-pie-overlay' viewBox='-1 -1 2 2'>
          <path d='${this.getPiePath()}' />
        </svg>`
        : "";
  }

  getPiePath() {
    const progress = this.props.progress();
    const largeArcFlag = progress >= 0.5 ? "1" : "0";
    // multiply by (1-ε) to make it look like a circle at progress=1
    const angle = 0.9999999 * progress * 2 * Math.PI;
    return [
      "M",
      0,
      0,
      "L",
      0,
      -1,
      "A",
      1,
      1,
      0,
      largeArcFlag,
      1,
      Math.sin(angle),
      -Math.cos(angle),
      "Z",
    ].join(" ");
  }
}
