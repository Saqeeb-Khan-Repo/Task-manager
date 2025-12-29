import { CirclesWithBar } from "react-loader-spinner";

export function Loading() {
  return (
    <div className="loading">
      <CirclesWithBar
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="audio-loading"
        wrapperStyle={{}}
        wrapperClass="wrapper-class"
        visible={true}
      />
    </div>
  );
}
