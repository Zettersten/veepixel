export const Nav = (props: Html.PropsWithChildren) => (<div id="nav">
    <a href="/" class="logo">
        <img height="50" src="/images/logo.svg" alt="VeePixel" />
    </a>
    {props.children}
</div>);