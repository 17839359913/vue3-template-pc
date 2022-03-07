// 引入公共js文件
import request from "./request";

export const querySequenceList = (data: any) =>
    request.get("/sequenceList", data);
export const deleteSeq = (data: any) =>
    request.post("/deletSequence", data);
export const createSeq = (data: any) =>
    request.get("/createSeq", data);
export const editSeq = (data: any) =>
    request.get("/editSeq", data);
