import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Material UI
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchRounded from '@material-ui/icons/SearchRounded';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom components
import ToolDetailPopup from '../../components/ToolDetailPopup';
import AddToolComponent from '../../components/AddToolComponent';
import { readAllTools, deleteTool, createTool } from '../../apiCalls';

// Styled components
const RootContainer = styled.div`
  margin: 40px;
`;

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchBarForm = styled.form`
  margin: 10px 0px;
`;

const GridItem = styled(Grid)`
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const ToolImage = styled.img`
  width: 100%;
  height: 300px;
  padding: 10px;
  box-sizing: border-box;
  object-fit: cover;
`;

function Home() {
  const [data, setData] = useState(null);
  const [filteredTools, setFilteredTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await readAllTools();
      setData(res);
      setFilteredTools(res);
    };
    fetch();
  }, []);

  const addTool = async (image, keywords) => {
    const newTool = await createTool(image, keywords);
    const newData = data;
    newData.push(newTool);
    setData(newData);
    const newFilteredTools = filteredTools;
    newFilteredTools.push(newTool);
    setFilteredTools(newFilteredTools);
  };

  const removeTool = async id => {
    await deleteTool(id);
    // Update the actual data
    const newData = [];
    data.forEach(d => {
      if (d._id !== id) {
        newData.push(d);
      }
    });
    setData(newData);
    // Update the data that is displayed
    const newFilteredTools = [];
    filteredTools.forEach(d => {
      if (d._id !== id) {
        newFilteredTools.push(d);
      }
    });
    setFilteredTools(newFilteredTools);
  };

  const filterTools = e => {
    const searchTerm = e.target.value;
    const newData = [];
    data.forEach(d => {
      for (let i = 0; i < d.keywords.length; i++) {
        const word = d.keywords[i];
        if (word.search(searchTerm) !== -1) {
          newData.push(d);
          break;
        }
      }
    });
    setFilteredTools(newData);
  };

  if (data === null) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <RootContainer>
      <SearchBarForm noValidate>
        <TextField
          onChange={filterTools}
          label='Search'
          placeholder='Type to search...'
          type='search'
          autoCorrect='off'
          autoCapitalize='off'
          autoComplete='off'
          spellCheck='false'
          id='search'
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchRounded />
              </InputAdornment>
            )
          }}
        />
      </SearchBarForm>

      <AddToolComponent createFunction={addTool} />

      <Grid container alignContent='stretch'>
        {filteredTools.map((d, index) => (
          <GridItem item xs={4} key={d._id} onClick={() => setSelectedTool(d)}>
            <ToolImage
              src={`data:image/jpg;base64, ${d.image.toString('base64')}`}
            />
          </GridItem>
        ))}
      </Grid>

      <ToolDetailPopup
        tool={selectedTool}
        isOpen={selectedTool !== null}
        close={() => setSelectedTool(null)}
        deleteFunction={removeTool}
      />
    </RootContainer>
  );
}

export default Home;
