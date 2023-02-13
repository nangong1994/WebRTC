export function InputEngine(props: any) {
  return (
    <textarea name="" id="type-area"
      onChange={(e: any) => {props.onChange(e.target.value)}}
      onKeyDown={(e: any) => {props.onkeydown(e)}}>        
    </textarea>
  );
}