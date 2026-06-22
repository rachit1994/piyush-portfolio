const values = [
  "Earn trust",
  "Win hearts",
  "Raise clarity",
  "Move faster",
  "Spark excitement",
];

export function ValueTags() {
  return (
    <div className="value-tags" aria-label="Design outcomes">
      {values.map((value, index) => (
        <span className={index === 2 ? "tilted" : ""} key={value}>
          {value}
        </span>
      ))}
    </div>
  );
}
