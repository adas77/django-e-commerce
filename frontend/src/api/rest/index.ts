import axios from "axios";
import { requestSuccessInterceptor } from "./inceptors/onRequest";
import {
  responseFailureInterceptor,
  responseSuccessInterceptor,
} from "./inceptors/onResponse";
import env from "@/utils/env";

const restClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: env.VITE_REST_ENDPOINT,
});

restClient.interceptors.request.use(requestSuccessInterceptor);
restClient.interceptors.response.use(
  responseSuccessInterceptor,
  responseFailureInterceptor
);

export default restClient;
