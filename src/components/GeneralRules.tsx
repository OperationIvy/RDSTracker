import { GENERAL_RULES } from "@/modules/level-catalog/levels";

export function GeneralRules() {
  return (
    <details className="general-rules">
      <summary>General RDS rules</summary>
      <ul>
        {GENERAL_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </details>
  );
}
