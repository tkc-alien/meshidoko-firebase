/**
 * 独自定義エラー
 */
abstract class AppError extends Error {
  code: string;
  alert: boolean;
  details?: unknown;

  /**
   * Constructor
   * @param { string } code
   * @param { should } alert
   * @param { string } message
   * @param { unknown } details
   */
  constructor(
    code: string,
    alert: boolean,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.code = code;
    this.alert = alert;
    this.details = details;
  }
}

/** 環境変数エラー */
export class InvalidEnvironmentError extends AppError {
  /**
   * Constructor
   * @param { unknown } values
   */
  constructor(values: unknown) {
    super("invalid-env", true, "環境変数が不正な値です。", values);
  }
}

/** リクエストバリデーションエラー */
export class InvalidRequestError extends AppError {
  /**
   * Constructor
   * @param { unknown } issues
   */
  constructor(issues: unknown) {
    super("invalid-request", false, "リクエストが不正な値です。", issues);
  }
}

/** 入力値エラー */
export class InvalidArgumentError extends AppError {
  /**
   * Constructor
   * @param { unknown } args
   */
  constructor(args: unknown) {
    super("invalid-argument", true, "入力値が不正な値です。", args);
  }
}

/** リソース不整合エラー */
export class InvalidResourceError extends AppError {
  /**
   * Constructor
   * @param { string } resource
   * @param { string } key
   */
  constructor(resource: string, key: string) {
    super("invalid-resource", true, "リソースの状態が正しくありません。", {
      resource,
      key,
    });
  }
}

/** リソース不存在エラー */
export class ResourceNotFoundError extends AppError {
  /**
   * Constructor
   * @param { string } resource
   * @param { string } key
   */
  constructor(resource: string, key: string) {
    super("resource-not-found", false, "リソースが存在しません。", {
      resource,
      key,
    });
  }
}

/** 抽選不許可エラー */
export class UnavailablePickError extends AppError {
  /**
   * Constructor
   * @param { Date } nextAvailableAt
   */
  constructor(nextAvailableAt: Date) {
    super("unavailable-pick", false, "抽選が許可されませんでした。", {
      nextAvailableAt,
    });
  }
}

/** レストラン不存在エラー */
export class NoRestarantsError extends AppError {
  /**
   * Constructor
   * @param { unknown } conditions
   */
  constructor(conditions: unknown) {
    super(
      "no-restaurants",
      false,
      "指定された条件でレストランが見つかりませんでした。",
      { conditions }
    );
  }
}

/** レストラン取得失敗エラー */
export class FailedToFetchRestaurantsError extends AppError {
  /**
   * Constructor
   * @param { string } status
   * @param { string } message
   * @param { object } request
   */
  constructor(status: string, message: string, request: object) {
    super(
      "failed-to-fetch-restaurans",
      false,
      "レストランの取得に失敗しました。",
      {
        status,
        message: message,
        request: {
          ...request,
          key: "HIDDEN BY API", // APIキーを隠す
        },
      }
    );
  }
}
