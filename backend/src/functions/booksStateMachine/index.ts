import getBookInfo from "./getBookInfo";
import onGetBookDetails from "./onGetBookDetails";
import onGetBookLink from "./onGetBookLink";
import onUpdateBookDetails from "./onUpdateBookDetails";
import onUpdateBookLink from "./onUpdateBookLink";

const booksStateMachine = {
  getBookInfo,
  onGetBookDetails,
  onGetBookLink,
  onUpdateBookDetails,
  onUpdateBookLink,
};

export default booksStateMachine;
