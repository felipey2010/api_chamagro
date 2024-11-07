import { Request } from "express";
import { DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SIZE } from "../constants";
import { FilterType } from "../types";

export default function extractFilter(req: Request): FilterType {
  const size = (req.query.size as number | undefined) || DEFAULT_SIZE;
  const page = (req.query.page as number | undefined) || DEFAULT_PAGE;
  const name = extractNameString(req.query.name);
  const order = (req.query.order as "asc" | "desc") || DEFAULT_ORDER;

  return {
    name,
    order,
    size: typeof size === "string" ? parseInt(size) : size,
    page: typeof page === "string" ? parseInt(page) : page,
  };
}

function extractNameString(query: any): string {
  if (typeof query === "string") {
    return decodeURI(query);
  } else {
    return "";
  }
}
