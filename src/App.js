import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Col,
  Row,
  Descriptions,
  Spin,
  Alert,
  Typography,
  Space
} from 'antd';
import './App.css';
import axios from 'axios';
import * as _ from 'lodash';
import logo from './assets/mtr_logo.png';
import backgrounds from './assets/background.jpg';

const App = () => {
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [sampleQuestion, setSampleQuestion] = useState([
    'What is the price from Mong Kok to Tuen Mun ?',
    'Which is the nearest exit between Moko and Mong Kok ?',
    'What is the route from Tsuen Wan to Wan Chai ?'
  ])
  const [questionHistory, setQuestionHistory] = useState([])

  const [suggestedQuestion, setSuggestedQuestion] = useState([])

  const answerQuestion = async () => {
    let resp_ans = []
    try {
      setLoading(true);
      setAnswer('');
      let resp = await axios.get(`http://127.0.0.1:5000/questions/${question}`);
      let { data } = resp;
      console.log('Data >>>', data)
      if (data.status == 1) {
        setAnswer(data.result)
        setSuggestedQuestion(data.predict)
        resp_ans = data.result;
      }
      else {
        setAnswer(data.dataMessage)
        resp_ans = data.dataMessage;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setAnswer(['Invalid question.'])
      resp_ans = ['Invalid question.'];
    } finally {
      setLoading(false);
      setQuestionHistory([...questionHistory, {
        'question': question,
        'answer': resp_ans,
      }])
    }
  }

  const renderSampleQuestion = () => {
    return (
      _.map(sampleQuestion, (value) => {
        return (
          <button
            type='button'
            onClick={() => setQuestion(value)}
            style={{ display: 'flex', padding: 15, backgroundColor: '#b5f5ec', border: '0px', outline: 'none', borderRadius: 50, maxWidth: '25%' }}>
            {value}
          </button>
        )
      })
    )
  }

  const renderPredictQuestion = () => {
    return (
      _.map(suggestedQuestion, (value) => {
        return (
          <button
            type='button'
            onClick={() => setQuestion(value)}
            style={{ display: 'flex', padding: 15, backgroundColor: '#efdbff', border: '0px', outline: 'none', borderRadius: 50, maxWidth: '25%' }}>
            {value}
          </button>
        )
      })
    )
  }

  return (
    <Row style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Question History</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {
                !_.isEmpty(questionHistory) ? _.map(questionHistory, (value) => {
                  return (
                    <Row>
                      <Typography.Title span={24} style={{ fontSize: 22 }}>{`Question:`}</Typography.Title>
                      <Typography.Text span={24} style={{ fontSize: 16 }}>{value.question}</Typography.Text>
                      <Typography.Title span={24} style={{ fontSize: 22 }}>{`Answer:`}</Typography.Title>
                      {
                        !_.isEmpty(value.answer) ? _.map(value.answer, (item) => {
                          return <Col span={24}>
                            <Typography.Text style={{ fontSize: 16 }}>{item}</Typography.Text>
                          </Col>
                        }) : null}
                    </Row>
                  )
                }) : null
              }
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <img
        src={backgrounds}
        style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: -1 }}
      />
      <Col style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
        <img
          src={logo}
          style={{ display: 'flex', objectFit: 'contain', width: 500, maxWidth: '85%' }} />
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingTop: 20, justifyContent: 'space-around' }}>

        <Row style={{ display: 'flex', flexDirection: 'row' }}>
          <Col flex={0.7} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
              placeholder="Input question" style={{ borderRadius: 30, height: '100%', maxWidth: '60%', minWidth: 300 }} id='specific_question'
              value={question}
              onKeyDown={(e) => e.keyCode == 13 ? answerQuestion() : ''}
              onChange={(value) => { setQuestion(value.target.value) }}
            />
          </Col>
          <Col flex={0.3} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 50 }}>
            <button
              type="button"
              className="btn"
              onClick={() => answerQuestion()}
              style={{ display: 'flex', flex: 0.2, justifyContent: 'center', alignItems: 'center', fontSize: 25, height: '100%', marginRight: 20, backgroundColor: '#69c0ff' }}>Ask</button>
            <button
              type='button'
              className="btn"
              data-toggle="modal" data-target="#exampleModal"
              style={{ display: 'flex', padding: 15, backgroundColor: '#ffd8bf', border: '0px', outline: 'none', borderRadius: 50 }}>
              Question History
          </button>
          </Col>
        </Row>

        <Row style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Typography.Text span={24} style={{ fontSize: 18, textAlign: 'center' }}>{_.isEmpty(suggestedQuestion) ?`Sample questions`: `Suggested questions`}</Typography.Text>
        </Row>

        <Row style={{ display: 'flex', flexDirection: 'row', maxWidth: '70%', alignSelf: 'center', justifyContent: 'space-around', marginTop: 20, width: '70%' }}>
          {
            _.isEmpty(suggestedQuestion) ? renderSampleQuestion() : renderPredictQuestion()
          }
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
          <Col style={{ border: '1px', borderRadius: 50, width: 450, minWidth: '55%', maxWidth: '95%', padding: 30, overflow: 'scroll', overflowY: 'auto', overflowX: 'hidden', backgroundColor: loading ? '#d9d9d9' : '#f4ffb8' }}>
            <Space direction='vertical'>
              <Typography.Text span={24} style={{ fontSize: 30 }}>{`Answer :`}</Typography.Text>
              <Descriptions>
                {
                  !_.isEmpty(answer) ? _.map(answer, (value) => {
                    return <Typography.Text span={24}>{value}</Typography.Text>
                  }) : null}
              </Descriptions>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row >

  );
}

export default App;
