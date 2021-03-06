import { useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, Button, Typography } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";

import JournalDisplay from "components/journalDisplay/JournalDisplay";
import ContentCard from "components/contentCard/ContentCard";
import Spinner from "components/UI/Spinner";
import DialogModal from "components/dialogModal/DialogModal";
import { useAuthStateValue } from "hooks/context/AuthStateProvider";
import { deleteAllJournalAction } from "reduxStore/actions/journalActions";

export default function Home() {
  const { userData, userDataError } = useAuthStateValue()[0];

  const [selectedJournalIndex, setSelectedJournalIndex] = useState(0);
  const [journalIdToDelete, setJournalIdToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const history = useHistory();

  const classes = useStyles();

  const dispatch = useDispatch();

  const journalsData = useSelector((state) => state.journalReducer.journals);
  const isLoading = useSelector((state) => state.journalReducer.loading);

  const onDeleteJournal = useCallback(
    (userData, docId) => {
      dispatch(deleteAllJournalAction(userData, docId));
    },
    [dispatch]
  );

  const getJournal = useCallback((dataIndex) => {
    setSelectedJournalIndex(dataIndex);
  }, []);

  const onEditHandler = (docId) => {
    history.push(`/write/${docId}`);
  };

  const onDeleteHandler = () => {
    if (isModalOpen) {
      onDeleteJournal(userData, journalIdToDelete);
      setIsModalOpen(false);
    }
  };

  const onOpenModalHandler = (docId) => {
    setIsModalOpen(true);
    setJournalIdToDelete(docId);
  };

  const onCloseModalHandler = () => {
    setIsModalOpen(false);
  };

  const introMessage = (
    <div className={classes.introMessage}>
      <Typography variant='h3' component='h2' className={classes.header}>
        Welcome to MyBook!
      </Typography>
      <Typography variant='body2' component='p' className={classes.subHeader}>
        Please <Link to='/auth'>log in</Link> to start
      </Typography>
    </div>
  );

  return (
    <>
      {!userData && userDataError ? (
        <>{introMessage}</>
      ) : (
        <>
          {isLoading && <Spinner />}
          {isModalOpen && (
            <DialogModal
              journalId={journalIdToDelete}
              isModalOpen={isModalOpen}
              onDelete={onDeleteHandler}
              onCloseModal={onCloseModalHandler}
            />
          )}
          <div className={classes.home}>
            <div className={classes.writeNew}>
              <Link to='/write'>
                <Button variant='outlined'>
                  <AddCircle /> write new
                </Button>
              </Link>
            </div>

            <div className={classes.container}>
              {/* Left side */}
              <div className={classes.cardContainer}>
                {journalsData.map((data, i) => (
                  <ContentCard
                    key={i}
                    dataIndex={i}
                    journalData={data}
                    getJournal={getJournal}
                    onEdit={onEditHandler}
                    onOpenModal={onOpenModalHandler}
                  />
                ))}
              </div>

              {/* Right side */}
              <JournalDisplay
                classes={classes}
                journalsData={journalsData}
                selectedJournalIndex={selectedJournalIndex}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

const useStyles = makeStyles({
  home: {
    marginTop: "75px",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: "1",
    flexBasis: "100%",
    padding: "0 20px 50px",
  },
  writeNew: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "35px",
    "& a": {
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
    },
    "& MuiButton-label": {
      color: "#6d6d6d",
    },
    "& .MuiSvgIcon-root": {
      color: "#98CDC6",
      marginRight: "10px",
    },
  },
  container: {
    display: "flex",
  },
  journalContainer: {
    flexGrow: "1",
    flexBasis: "100%",
    padding: "0 20px 50px",
  },
  journalContent: {
    paddingBottom: "16px",
    top: "0",
  },
  journalDate: {
    padding: "10px 5px 15px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#4f4f4f",
    borderBottom: "1px solid #eeeeee",
  },
  journalDescription: {
    marginTop: "20px",
    padding: "0 5px",
    fontSize: "1.05rem",
    fontWeight: "500",
    color: "#555555",
    whiteSpace: "pre-wrap",
  },
  date: {
    color: "#98CDC6",
    marginRight: "5px",
  },
  day: {
    color: "#CFB491",
  },
  time: {
    marginLeft: "20px",
    fontSize: "0.85rem",
    color: "#98CDC6",
  },
  introMessage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  header: {
    marginBottom: "10px",
    fontSize: "1.7rem",
    color: "#98CDC6",
    textAlign: "center",
  },
  subHeader: {
    fontSize: "1.2rem",
    color: "#b4b4b4",
    textAlign: "center",
    "& a": {
      color: "#b4b4b4",
      textDecoration: "none",
      fontWeight: "bold",
    },
  },
});
