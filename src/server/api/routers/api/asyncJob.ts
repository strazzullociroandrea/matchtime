import { TRPCError } from "@trpc/server";

/**
 * Function that wraps a job with start and end messages, useful for logging and user feedback
 *
 * @param startMessage Initial Message to indicate the start of the job
 * @param job Function that performs the job, can return a value or a Promise
 * @param endMessage Final Message to indicate the completion of the job
 *
 * @return The result of the job, if it returns a value or a Promise that resolves to a value
 */
const asyncJob = async <T>(
  startMessage: string,
  job: () => T | Promise<T>,
  endMessage: string,
) => {
  const formattedDate = new Date().toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  try {
    console.log(`${formattedDate} - [LOG] ${startMessage}`);
    const result = await job();
    console.log(`${formattedDate} - [LOG] ${endMessage}`);
    return result;
  } catch (e) {
    if (e instanceof TRPCError) {
      console.error(
        `${formattedDate} - [ERROR] tRPC Error: ${e.message},\ncause: ${e.cause}`,
      );
      throw e;
    }
    console.log(`${formattedDate} - [ERROR] Error during job execution: ${e}`);
    throw new Error(`Error during job execution: ${e}`, {
      cause: e instanceof Error ? e : undefined,
    });
  }
};

export default asyncJob;
