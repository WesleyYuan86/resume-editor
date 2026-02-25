import { useState, useRef } from 'react'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('basic')
  const [data, setData] = useState({
    titles: {
      basic: "基本信息",
      intention: "求职岗位",
      education: "教育背景",
      work: "工作经验",
      skills: "技能特长",
      honors: "荣誉证书",
      evaluation: "自我评价",
      custom: "自定义模块"
    },
    visibility: {
      basic: true,
      intention: true,
      education: true,
      work: true,
      skills: true,
      honors: true,
      evaluation: true,
      custom: false
    },
    basic: {
      name: "bilibili", gender: "男", age: "1992-10",
      exp: "4年经验", phone: "15688888883", email: "qmjianli@qq.com",
      height: "", weight: "", ethnicity: "",
      hometown: "上海", political: "不填", marital: "不填"
    },
    intention: { target: "程序员", city: "上海", salary: "10000/月", time: "一个月内到岗" },
    education: { time: "2015-09 ~ 2018-07", school: "bilibili技术大学", major: "计算机科学与技术（本科）", courses: "数据结构与算法、数据库系统、Java、操作系统。", skills: "熟练掌握C/C++、Java。" },
    work: [
      { id: 1, time: "2018-09 ~ 至今", company: "bilibili科技有限公司", position: "程序员", desc: "• 负责前端页面开发与维护。\n• 参与移动端适配工作。" },
      { id: 2, time: "2016-09 ~ 2018-08", company: "上海XX网络科技有限公司", position: "程序员", desc: "• 参与独立模块开发。" }
    ],
    skills: {
      desc: "• 精通Java，熟悉Spring等技术。\n• 掌握前端开发基础。",
      bars: [
        { name: "计算机", level: "精通", percent: 80 },
        { name: "英语", level: "良好", percent: 70 }
      ]
    },
    honors: "• 英语四级，听说读写能力良好\n• 通过全国计算机二级考试",
    evaluation: "具有扎实的计算机基础和丰富的开发经验。团队合作能力强。",
    customSections: []
  })

  // Helper to deep update nested data via string path "basic.name"
  const updateData = (path, value) => {
    setData((prev) => {
      const paths = path.split('.');
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < paths.length - 1; i++) {
        current[paths[i]] = Array.isArray(current[paths[i]]) ? [...current[paths[i]]] : { ...current[paths[i]] };
        current = current[paths[i]];
      }
      current[paths[paths.length - 1]] = value;
      return newData;
    });
  }

  const tabs = [
    { id: 'basic', label: '基本信息' },
    { id: 'intention', label: '求职岗位' },
    { id: 'education', label: '教育背景' },
    { id: 'work', label: '工作经验' },
    { id: 'skills', label: '技能特长' },
    { id: 'honors', label: '荣誉证书' },
    { id: 'evaluation', label: '自我评价' },
    { id: 'custom', label: '自定义...' }
  ];

  const handleEditTitle = (e, tabId) => {
    e.stopPropagation();
    const newTitle = prompt("请输入新的模块标题：", data.titles[tabId] || "");
    if (newTitle) updateData(`titles.${tabId}`, newTitle);
  }

  const toggleVisibility = (e, tabId) => {
    e.stopPropagation();
    updateData(`visibility.${tabId}`, !data.visibility[tabId]);
  }

  // Common render string component (skip empty lines to maintain tight layout)
  const TextLines = ({ text }) => {
    if (!text) return null;
    return <div className="text-area">{text}</div>;
  }

  return (
    <div className="app-container">
      {/* Editor Pane (Left Sidebar Form) */}
      <div className="editor-pane">
        {/* Tabs Bar */}
        <div className="tabs-container">
          {tabs.map(tab => (
            <div key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <div className="tab-header-top">
                <div className={`switch ${data.visibility[tab.id] ? 'on' : ''}`} onClick={(e) => toggleVisibility(e, tab.id)}></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {data.titles[tab.id] || tab.label}
                <i className="edit-icon" title="修改模块标题" onClick={(e) => handleEditTitle(e, tab.id)}>✎</i>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Form Content */}
        <div className="form-container">
          <div className="form-hint"><i>ℹ</i> 填写后会自动排版在最终网页中，部分信息可以选择不填或删除内容。</div>

          {activeTab === 'basic' && (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">您的姓名</div>
                  <input className="form-input" value={data.basic.name} onChange={e => updateData('basic.name', e.target.value)} />
                </div>
                <div className="form-group">
                  <div className="form-label">性别</div>
                  <select className="form-select" value={data.basic.gender} onChange={e => updateData('basic.gender', e.target.value)}>
                    <option>男</option><option>女</option><option>不填</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className="form-label">出生年月</div>
                  <input className="form-input" type="month" value={data.basic.age} onChange={e => updateData('basic.age', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">工作年限</div>
                  <input className="form-input" value={data.basic.exp} onChange={e => updateData('basic.exp', e.target.value)} />
                </div>
                <div className="form-group">
                  <div className="form-label">联系电话</div>
                  <input className="form-input" value={data.basic.phone} onChange={e => updateData('basic.phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <div className="form-label">联系邮箱</div>
                  <input className="form-input" value={data.basic.email} onChange={e => updateData('basic.email', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">婚烟状况</div>
                  <select className="form-select" value={data.basic.marital} onChange={e => updateData('basic.marital', e.target.value)}>
                    <option>已婚</option><option>未婚</option><option>保密</option><option>不填</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className="form-label">身高/体重</div>
                  <input className="form-input" style={{ width: '45%' }} placeholder="身高(cm)" value={data.basic.height} onChange={e => updateData('basic.height', e.target.value)} />
                  <span style={{ margin: '0 5px' }}>-</span>
                  <input className="form-input" style={{ width: '45%' }} placeholder="体重(kg)" value={data.basic.weight} onChange={e => updateData('basic.weight', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">民族</div>
                  <input className="form-input" placeholder="请输入民族" value={data.basic.ethnicity} onChange={e => updateData('basic.ethnicity', e.target.value)} />
                </div>
                <div className="form-group">
                  <div className="form-label">籍贯</div>
                  <input className="form-input" value={data.basic.hometown} onChange={e => updateData('basic.hometown', e.target.value)} />
                </div>
                <div className="form-group">
                  <div className="form-label">政治面貌</div>
                  <select className="form-select" value={data.basic.political} onChange={e => updateData('basic.political', e.target.value)}>
                    <option>党员</option><option>团员</option><option>群众</option><option>不填</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'intention' && (
            <div>
              <div className="form-row">
                <div className="form-group col">
                  <div className="form-label">期望岗位</div>
                  <input className="form-input" value={data.intention.target} onChange={e => updateData('intention.target', e.target.value)} />
                </div>
                <div className="form-group col">
                  <div className="form-label">期望城市</div>
                  <input className="form-input" value={data.intention.city} onChange={e => updateData('intention.city', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <div className="form-label">期望薪资</div>
                  <input className="form-input" value={data.intention.salary} onChange={e => updateData('intention.salary', e.target.value)} />
                </div>
                <div className="form-group col">
                  <div className="form-label">入职时间</div>
                  <input className="form-input" value={data.intention.time} onChange={e => updateData('intention.time', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <div className="form-row">
                <div className="form-group col">
                  <div className="form-label">就读时间</div>
                  <input className="form-input" value={data.education.time} onChange={e => updateData('education.time', e.target.value)} />
                </div>
                <div className="form-group col">
                  <div className="form-label">学校名称</div>
                  <input className="form-input" value={data.education.school} onChange={e => updateData('education.school', e.target.value)} />
                </div>
                <div className="form-group col">
                  <div className="form-label">专业学历</div>
                  <input className="form-input" value={data.education.major} onChange={e => updateData('education.major', e.target.value)} />
                </div>
              </div>
              <div className="form-group col" style={{ marginBottom: '15px' }}>
                <div className="form-label">主修课程</div>
                <textarea className="form-textarea" value={data.education.courses} onChange={e => updateData('education.courses', e.target.value)} />
              </div>
              <div className="form-group col">
                <div className="form-label">主要技能</div>
                <textarea className="form-textarea" value={data.education.skills} onChange={e => updateData('education.skills', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div>
              {data.work.map((w, i) => (
                <div className="item-card" key={w.id}>
                  <div className="item-card-header">
                    <strong>经历 {i + 1}</strong>
                    <button className="btn-remove" onClick={() => {
                      const newWork = [...data.work];
                      newWork.splice(i, 1);
                      updateData('work', newWork);
                    }}>删除此项</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group col">
                      <div className="form-label">工作时间</div>
                      <input className="form-input" value={w.time} onChange={e => {
                        const newWork = [...data.work]; newWork[i].time = e.target.value; updateData('work', newWork);
                      }} />
                    </div>
                    <div className="form-group col">
                      <div className="form-label">公司名称</div>
                      <input className="form-input" value={w.company} onChange={e => {
                        const newWork = [...data.work]; newWork[i].company = e.target.value; updateData('work', newWork);
                      }} />
                    </div>
                    <div className="form-group col">
                      <div className="form-label">担任职位</div>
                      <input className="form-input" value={w.position} onChange={e => {
                        const newWork = [...data.work]; newWork[i].position = e.target.value; updateData('work', newWork);
                      }} />
                    </div>
                  </div>
                  <div className="form-group col">
                    <div className="form-label">工作内容</div>
                    <textarea className="form-textarea" value={w.desc} onChange={e => {
                      const newWork = [...data.work]; newWork[i].desc = e.target.value; updateData('work', newWork);
                    }} />
                  </div>
                </div>
              ))}
              <button className="btn-add" onClick={() => {
                updateData('work', [...data.work, { id: Date.now(), time: "", company: "", position: "", desc: "" }]);
              }}>+ 添加工作经验</button>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <div className="form-group col" style={{ marginBottom: '20px' }}>
                <div className="form-label">技能描述 (多行文本)</div>
                <textarea className="form-textarea" value={data.skills.desc} onChange={e => updateData('skills.desc', e.target.value)} />
              </div>

              <strong>可视化技能条</strong>
              <div style={{ marginTop: '10px' }}>
                {data.skills.bars.map((bar, i) => (
                  <div className="item-card" key={i} style={{ padding: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input className="form-input" placeholder="小项名称 (如：英语)" value={bar.name} onChange={e => {
                      const newBars = [...data.skills.bars]; newBars[i].name = e.target.value; updateData('skills.bars', newBars);
                    }} />
                    <input className="form-input" placeholder="等级 (如：精通)" value={bar.level} onChange={e => {
                      const newBars = [...data.skills.bars]; newBars[i].level = e.target.value; updateData('skills.bars', newBars);
                    }} />
                    <input type="range" min="0" max="100" value={bar.percent} onChange={e => {
                      const newBars = [...data.skills.bars]; newBars[i].percent = parseInt(e.target.value); updateData('skills.bars', newBars);
                    }} />
                    <span>{bar.percent}%</span>
                    <button className="btn-remove" onClick={() => {
                      const newBars = [...data.skills.bars]; newBars.splice(i, 1); updateData('skills.bars', newBars);
                    }}>删除</button>
                  </div>
                ))}
                <button className="btn-add" onClick={() => updateData('skills.bars', [...data.skills.bars, { name: "新技能", level: "熟练", percent: 50 }])}>
                  + 添加技能条
                </button>
              </div>
            </div>
          )}

          {activeTab === 'honors' && (
            <div className="form-group col">
              <div className="form-label">荣誉证书描述</div>
              <textarea className="form-textarea" style={{ minHeight: '150px' }} value={data.honors} onChange={e => updateData('honors', e.target.value)} />
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="form-group col">
              <div className="form-label">自我评价段落</div>
              <textarea className="form-textarea" style={{ minHeight: '150px' }} value={data.evaluation} onChange={e => updateData('evaluation', e.target.value)} />
            </div>
          )}

          {activeTab === 'custom' && (
            <div>
              {data.customSections.map((sec, i) => (
                <div className="item-card" key={sec.id}>
                  <div className="item-card-header">
                    <strong>自定义内容 {i + 1}</strong>
                    <button className="btn-remove" onClick={() => {
                      const newSecs = [...data.customSections]; newSecs.splice(i, 1); updateData('customSections', newSecs);
                    }}>删除</button>
                  </div>
                  <div className="form-group col" style={{ marginBottom: '10px' }}>
                    <div className="form-label">模块标题</div>
                    <input className="form-input" value={sec.title} onChange={e => {
                      const newSecs = [...data.customSections]; newSecs[i].title = e.target.value; updateData('customSections', newSecs);
                    }} />
                  </div>
                  <div className="form-group col">
                    <div className="form-label">主要内容</div>
                    <textarea className="form-textarea" value={sec.content} onChange={e => {
                      const newSecs = [...data.customSections]; newSecs[i].content = e.target.value; updateData('customSections', newSecs);
                    }} />
                  </div>
                </div>
              ))}
              <button className="btn-add" onClick={() => updateData('customSections', [...data.customSections, { id: Date.now(), title: "自定义模块", content: "..." }])}>
                + 添加新自定义模块
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Pane (Right Sidebar Read-Only) */}
      <div className="preview-pane">
        <div className="preview-toolbar hide-on-print">
          <button className="btn-print" onClick={() => window.print()}>打印 / 导出 PDF</button>
        </div>

        <div className="resume-paper" id="resume-preview">
          {/* Basic Info */}
          {data.visibility.basic && (
            <div className="section">
              <h2 className="section-title">{data.titles.basic}</h2>
              <div className="basic-info-grid">
                {data.basic.name && (
                  <div className="info-row">
                    <span className="info-label">姓<span className="spacer"></span>名：</span>
                    <span className="info-value">{data.basic.name}</span>
                  </div>
                )}
                {data.basic.age && (
                  <div className="info-row">
                    <span className="info-label">年<span className="spacer"></span>龄：</span>
                    <span className="info-value">{data.basic.age}</span>
                  </div>
                )}
                {data.basic.gender && data.basic.gender !== '不填' && (
                  <div className="info-row">
                    <span className="info-label">性<span className="spacer"></span>别：</span>
                    <span className="info-value">{data.basic.gender}</span>
                  </div>
                )}
                {data.basic.hometown && (
                  <div className="info-row">
                    <span className="info-label">籍<span className="spacer"></span>贯：</span>
                    <span className="info-value">{data.basic.hometown}</span>
                  </div>
                )}
                {data.basic.exp && (
                  <div className="info-row">
                    <span className="info-label">工作年限：</span>
                    <span className="info-value">{data.basic.exp}</span>
                  </div>
                )}
                {data.basic.phone && (
                  <div className="info-row">
                    <span className="info-label">电<span className="spacer"></span>话：</span>
                    <span className="info-value">{data.basic.phone}</span>
                  </div>
                )}
                {data.basic.email && (
                  <div className="info-row">
                    <span className="info-label">邮<span className="spacer"></span>箱：</span>
                    <span className="info-value">{data.basic.email}</span>
                  </div>
                )}
                {data.basic.marital && data.basic.marital !== '不填' && (
                  <div className="info-row">
                    <span className="info-label">婚姻状况：</span>
                    <span className="info-value">{data.basic.marital}</span>
                  </div>
                )}
                {(data.basic.height || data.basic.weight) && (
                  <div className="info-row">
                    <span className="info-label">身高体重：</span>
                    <span className="info-value">{data.basic.height} {data.basic.height && 'cm'} {data.basic.weight} {data.basic.weight && 'kg'}</span>
                  </div>
                )}
                {data.basic.ethnicity && (
                  <div className="info-row">
                    <span className="info-label">民<span className="spacer"></span>族：</span>
                    <span className="info-value">{data.basic.ethnicity}</span>
                  </div>
                )}
                {data.basic.political && data.basic.political !== '不填' && (
                  <div className="info-row">
                    <span className="info-label">政治面貌：</span>
                    <span className="info-value">{data.basic.political}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Intention */}
          {data.visibility.intention && (
            <div className="section">
              <h2 className="section-title">{data.titles.intention}</h2>
              <div className="two-cols">
                {data.intention.target && (
                  <div className="info-row">
                    <span className="info-label" style={{ width: '80px' }}>求职意向：</span>
                    <span>{data.intention.target}</span>
                  </div>
                )}
                {data.intention.city && (
                  <div className="info-row">
                    <span className="info-label" style={{ width: '80px' }}>意向城市：</span>
                    <span>{data.intention.city}</span>
                  </div>
                )}
                {data.intention.salary && (
                  <div className="info-row">
                    <span className="info-label" style={{ width: '80px' }}>期望薪资：</span>
                    <span>{data.intention.salary}</span>
                  </div>
                )}
                {data.intention.time && (
                  <div className="info-row">
                    <span className="info-label" style={{ width: '80px' }}>入职时间：</span>
                    <span>{data.intention.time}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {data.visibility.education && (
            <div className="section">
              <h2 className="section-title">{data.titles.education}</h2>
              <div className="row-flex bold-text">
                <span>{data.education.time}</span>
                <span>{data.education.school}</span>
                <span className="dim-text">{data.education.major}</span>
              </div>
              <div className="mt-2 text-area">
                {data.education.courses && <><span className="dim-text">主修课程：</span>{data.education.courses}<br /></>}
                {data.education.skills && <><span className="dim-text">主要技能：</span>{data.education.skills}</>}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {data.visibility.work && (
            <div className="section">
              <h2 className="section-title">{data.titles.work}</h2>
              {data.work.map((w) => (
                <div className="work-item" key={w.id}>
                  <div className="row-flex bold-text">
                    <span>{w.time}</span>
                    <span>{w.company}</span>
                    <span className="dim-text">{w.position}</span>
                  </div>
                  <TextLines text={w.desc} />
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data.visibility.skills && (
            <div className="section">
              <h2 className="section-title">{data.titles.skills}</h2>
              <TextLines text={data.skills.desc} />
              <div className="skill-bars">
                {data.skills.bars.map((bar, i) => (
                  <div className="skill-bar-item" key={i}>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${bar.percent}%` }}></div>
                    </div>
                    <div className="bar-labels">
                      <span>{bar.name}</span>
                      <span className="dim-text">{bar.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Honors */}
          {data.visibility.honors && (
            <div className="section">
              <h2 className="section-title">{data.titles.honors}</h2>
              <TextLines text={data.honors} />
            </div>
          )}

          {/* Evaluation */}
          {data.visibility.evaluation && (
            <div className="section">
              <h2 className="section-title">{data.titles.evaluation}</h2>
              <TextLines text={data.evaluation} />
            </div>
          )}

          {/* Custom Sections */}
          {data.visibility.custom && data.customSections.map(sec => (
            <div className="section" key={sec.id}>
              <h2 className="section-title">{sec.title}</h2>
              <TextLines text={sec.content} />
            </div>
          ))}

        </div>
      </div>
    </div >
  )
}

export default App
