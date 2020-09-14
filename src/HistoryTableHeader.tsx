import React, { useContext } from "react";
import { UnfoldIcon, FoldIcon } from "@primer/octicons-react";

import { AppContext } from "./UserHistory";

export default function HistoryTableHeader(props: {
  title: string;
  setShowNoHistory: (val: boolean) => void;
  showNoHistory: boolean;
}) {
  const context = useContext(AppContext);
  return (
    <tr>
      <th>
        <div className="section-header">
          <div className="section-header-title">
            <h2>{props.title}</h2>
            <div
              role="button"
              className="show-no-history clickable"
              title="Show/Hide tasks with no data"
              onClick={() => props.setShowNoHistory(!props.showNoHistory)}
            >
              {props.showNoHistory ? (
                <FoldIcon aria-hidden="true" />
              ) : (
                <UnfoldIcon aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </th>
      {context.dates.map((day) => (
        <th>
          <div className="date date-heading">
            <span>{day.format("ddd")}</span>
            <span>{day.format("DD")}</span>
          </div>
        </th>
      ))}
    </tr>
  );
}
