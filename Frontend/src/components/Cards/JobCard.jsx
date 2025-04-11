import React from "react";
import { MdCreate, MdOutlinePushPin, MdDelete } from "react-icons/md";
import moment from "moment";

const JobCard = ({
  company,
  date,
  role,
  status,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  applicationLink
}) => {

  const formatLink = (link) => {
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      return "https://" + link;
    }
    return link;
  };

  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{company}</h6>
          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-blue-600" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>

      <p className="text-xs text-slate-600 mt-2">{role?.slice(0, 60)}</p>

      <p className="text-xs text-slate-500 mt-1">
        Status: <span className="capitalize">{status}</span>
      </p>

      {applicationLink && (
        <a
          href={formatLink(applicationLink)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-xs mt-1 inline-block underline"
        >
          Click to Apply
        </a>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
