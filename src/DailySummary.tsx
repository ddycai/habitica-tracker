import React, { useContext, useState } from "react";
import moment from "moment";
import log from "loglevel";
import { UnfoldIcon, FoldIcon } from "@primer/octicons-react";

import { DATE_KEY_FORMAT } from "./App";
import { Task } from "./HabiticaTypes";
import { AppContext } from "./UserSummary";
import { TaskIcon } from "./TaskIcon";

export interface DailySummaryProps {
  data: Task[];
}

export default function DailySummary(props: DailySummaryProps) {
  const context = useContext(AppContext);
  const [showNoHistory, setShowNoHistory] = useState(false);

  return (
    <section className="dailys">
      <table>
        <tr>
          <th>
            <div className="section-header">
              <h2>Dailies</h2>
              <div
                role="button"
                className="show-no-history clickable"
                title="Show/Hide dailies with no data"
                onClick={() => setShowNoHistory(!showNoHistory)}
              >
                {showNoHistory ? (
                  <FoldIcon aria-hidden="true" />
                ) : (
                  <UnfoldIcon aria-hidden="true" />
                )}
              </div>
            </div>
          </th>
          {context.dates.map((day) => (
            <th>
              <div className="date-heading">
                <span>{day.format("MM")}</span>
                <span>{day.format("DD")}</span>
              </div>
            </th>
          ))}
        </tr>
        {props.data.map((daily) => (
          <Daily showNoHistory={showNoHistory} daily={daily} />
        ))}
      </table>
      <div
        className="link show-no-history"
        onClick={() => setShowNoHistory(!showNoHistory)}
      ></div>
    </section>
  );
}

export function Daily(props: { daily: Task; showNoHistory: boolean }) {
  const context = useContext(AppContext);
  const historyMap = new Map<string, number>();

  const { text, history } = props.daily;

  log.debug(text);
  for (let i = 0; i < history.length; i++) {
    let delta;
    if (i === 0) {
      delta = history[i].value;
    } else {
      delta = history[i].value - history[i - 1].value;
    }
    let taskUpdateTime = moment(history[i].date);
    log.debug(
      taskUpdateTime.format("YYYY-MM-DD HH:mm:ss") + ": " + history[i].value
    );
    // Only consider times when the task value changes (or the first value).
    if (delta !== 0) {
      // This task update was done via cron so the task was actually done the
      // day before.
      if (
        context.cronIntervals.search(
          taskUpdateTime.unix(),
          taskUpdateTime.unix()
        ).length > 0
      ) {
        // Daily could have been completed twice in the cron time so if this is
        // the second time, don't subtract a day.
        if (!historyMap.has(taskUpdateTime.format(DATE_KEY_FORMAT))) {
          taskUpdateTime = taskUpdateTime.subtract(1, "day");
        } else {
          log.debug(`Multiple daily completions on for ${text} on ${taskUpdateTime}`);
        }
      }
        const taskDate = taskUpdateTime.format(DATE_KEY_FORMAT);
      historyMap.set(taskDate, delta);
    }
  }

  const dailyDeltas = context.dates
    .map((day) => day.format(DATE_KEY_FORMAT))
    .map((day) => historyMap.get(day));

  if (
    dailyDeltas.filter((delta) => delta !== undefined).length === 0 &&
    !props.showNoHistory
  ) {
    // Don't render the component if showNoHistory is off.
    return null;
  }

  return (
    <tr>
      <td className="task-name-row">
        <TaskIcon task={props.daily} />
        <span className="task-name">{text}</span>
      </td>
      {dailyDeltas.map((delta) => (
        <DailyStatus delta={delta} />
      ))}
    </tr>
  );
}

function DailyStatus(props: { delta: number | undefined }) {
  let classNames = ["daily-cell"];
  let symbol;
  if (!props.delta || props.delta === 0) {
    classNames.push("pass");
    symbol = "\xa0";
  } else if (props.delta > 0) {
    classNames.push("success");
    symbol = "✓";
  } else {
    classNames.push("fail");
    symbol = "✖";
  }
  return (
    <td className={classNames.join(" ")}>
      {symbol && (
        <div className="center-wrapper">
          <span className="symbol">{symbol}</span>
        </div>
      )}
    </td>
  );
}
