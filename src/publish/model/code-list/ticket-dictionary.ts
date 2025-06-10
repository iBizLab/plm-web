export default {
  codeListTag: 'ticket_dictionary',
  codeListType: 'STATIC',
  codeName: 'ticket_dictionary',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'ticket_status',
      text: '工单状态',
      value: 'ticket_status',
      id: 'ticket_status',
    },
    {
      codeName: 'ticket_solution',
      text: '工单解决方案',
      value: 'ticket_solution',
      id: 'ticket_solution',
    },
    {
      codeName: 'ticket_priority',
      text: '工单优先级',
      value: 'ticket_priority',
      id: 'ticket_priority',
    },
  ],
  enableCache: true,
  name: '工单字典',
  id: 'plmweb.ticket_dictionary',
};
