
const emailInfo =  (data) => {
    return `
    <div>
    <div>${data.Subject}${data.SubjectContent}</div>
        <div>${data.CustomerName},</div>
        <div>${data.ContentInner}</div>
        <div>${data.ContentFooter} </div>
       </div>`
};

export default emailInfo;
