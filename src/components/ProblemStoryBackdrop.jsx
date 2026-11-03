import illustration from "../assets/problem/story-illustration-bg.png";

export default function ProblemStoryBackdrop({ className = "" }) {
  return (
    <div aria-hidden="true" className={`problem-story-backdrop ${className}`}>
      <img className="problem-story-backdrop__art" src={illustration} alt="" />
    </div>
  );
}
