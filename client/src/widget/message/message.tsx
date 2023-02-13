
export function MessageInfo(props: any) {
  return (
    <div style={{position: 'relative', minHeight: '20px'}}>
      {
        props.msg.user === props.owner ? (
          <div style={{right: '5px', justifyContent: 'end', ...msgBoxStyle}}>
            <div style={{background: '#5fdc5f', ...msgStyle, marginRight: '5px'}}>{props.msg.message}</div>
            <div style={{...aliaStyle}}>{String(props.msg.user[0]).toLocaleUpperCase()}</div>
          </div>
        ) : (
          <div style={{left: '5px', justifyContent: 'left', ...msgBoxStyle}}>
            <div style={{...aliaStyle}}>{props.user[0].toLocaleUpperCase()}</div>
            <div style={{...userNameDisplayBoxStyle}}>
                <div style={{...userNameDisplayStyle}}>{props.user}</div>
                <div style={{background: 'transparent', ...msgStyle, marginLeft: '5px'}}>{props.msg.message}</div>
            </div>
          </div>
        )
      }
    </div>
  ); 
}

const msgBoxStyle: React.CSSProperties = {
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  minHeight: '20px'
}

const msgStyle: React.CSSProperties = {
  right: '5px',
  padding: '5px',
  borderRadius: '5px',
  maxWidth: '350px',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  border: '0.5px solid rgb(201, 198, 198)'
}

const aliaStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '50%',
  justifyContent: 'center',
  alignSelf: 'baseline',
  border: '1px solid rgb(201, 198, 198)'
}

const userNameDisplayBoxStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateRows: '20px auto'
}

const userNameDisplayStyle: React.CSSProperties = {
  color: 'grey',
  width: '100px',
  fontSize: '12px',
  marginLeft: '5px',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}