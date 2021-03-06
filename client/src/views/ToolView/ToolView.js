import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import numeral from 'numeral';

// Custom components
import { AuthContext } from '../../Auth';
import { withToolData } from '../../components/ToolDataContext';
import AddEditToolComponent from '../../components/AddEditToolComponent';
import { addToolRetrieval } from '../../apiCalls';
import RetrievalComponent from '../../components/RetrievalComponent';
import RetrievalChart from '../../components/RetrievalChart';
import ConfirmDialog from '../../components/ConfirmDialog';

// Material UI
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';

// Styled components
const RootContainer = styled.div`
  padding-top: 120px;
  padding-bottom: 40px;
`;

const ToolViewContainer = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ToolImage = styled.img`
  width: 100%;
  object-fit: cover;
`;

const KeywordContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  margin: 20px 0px;
  flex-wrap: wrap;
`;

const BackButtonContainer = styled.div`
  position: fixed;
  top: 40px;
  left: 40px;
`;

const ToolView = ({ toolData }) => {
  const authContext = useContext(AuthContext);
  const [tool, setTool] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetch = async () => {
      if (id !== null) {
        const res = await toolData.fetchTool(id);
        setTool(res);
      }
    };
    fetch();
    authContext.refreshAuth();
  }, []);

  const goBack = () => history.goBack();

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  const deleteTool = async () => {
    await toolData.deleteTool(id);
    closeConfirm();
    goBack();
  };

  const updateTool = async (image, keywords) => {
    const res = await toolData.updateTool(image, keywords, id);
    setTool(res);
  };

  const addRetrieval = async (timePassed) => {
    console.log(tool);
    const res = await addToolRetrieval(timePassed, id);
    setTool(res);
    console.log(res);
  };

  const renderImage = () => {
    if (tool === null) {
      return (
        <Skeleton
          variant='rect'
          width='100%'
          height={500}
          style={{ marginBottom: 20 }}
        />
      );
    } else {
      const src = `data:image/jpg;base64, ${tool.image.toString('base64')}`;
      return <ToolImage src={src} style={{ marginBottom: 20 }} />;
    }
  };

  const renderKeywords = () => {
    let comp = <React.Fragment />;
    if (tool === null) {
      comp = <Skeleton variant='rect' width='100%' height={100} />;
    } else {
      comp = tool.keywords.map((word, index) => (
        <Chip key={index} label={word} style={{ margin: 5 }} color='primary' />
      ));
    }
    return <KeywordContainer>{comp}</KeywordContainer>;
  };

  const renderChart = () => {
    if (authContext.authenticated) {
      let comp = null;
      if (tool === null) {
        comp = <Skeleton variant='rect' width='100%' height={400} />;
      } else {
        comp = <RetrievalChart retrievalHistory={tool.retrievalHistory} />;
      }
      return comp;
    } else {
      return;
    }
  };

  const renderDeleteButton = () => {
    return (
      <Button
        variant='text'
        color='secondary'
        endIcon={<DeleteRoundedIcon />}
        onClick={openConfirm}
      >
        Delete
      </Button>
    );
  };

  const renderAvgRetrievalTime = () => {
    if (tool === null) {
      return <Skeleton variant='text' width='100%' height={40} />;
    } else {
      return (
        <Typography>
          Avg. Retrieval Time: {numeral(tool.avgRetrievalTime).format('0.00')}{' '}
          (s)
        </Typography>
      );
    }
  };

  return (
    <RootContainer>
      <BackButtonContainer>
        <IconButton onClick={goBack}>
          <ArrowBackRoundedIcon />
        </IconButton>
      </BackButtonContainer>

      {authContext.authenticated && (
        <AddEditToolComponent tool={tool} actionButtonFunction={updateTool} />
      )}

      <ConfirmDialog
        title='Delete this tool?'
        description='Are you sure that you want to delete this tool?'
        open={confirmOpen}
        closeFunction={closeConfirm}
        confirmFunction={deleteTool}
      />

      <Container maxWidth='md'>
        <ToolViewContainer>
          {renderImage()}
          <Typography variant='h6'>Keywords</Typography>
          {renderKeywords()}
          <RetrievalComponent addRetrieval={addRetrieval} />
          {renderChart()}
          {authContext.authenticated && renderAvgRetrievalTime()}
          {authContext.authenticated && (
            <Divider style={{ padding: '20px 0px' }} />
          )}
          {authContext.authenticated && renderDeleteButton()}
        </ToolViewContainer>
      </Container>
    </RootContainer>
  );
};

export default withToolData(ToolView);
