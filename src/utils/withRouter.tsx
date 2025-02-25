import  { Component } from "react";
import { Location, NavigateFunction, Params, useLocation, useNavigate, useParams } from "react-router-dom";

// This is a helper component to inject router props into class components
export function withRouter(WrappedComponent: any) {
  class WithRouter extends Component {
    render() {
      return (
        <WrappedComponent
          {...this.props}
          match={{
            params: (this.props as any).params as Params,
            location: (this.props as any).location as Location,
            navigate: (this.props as any).navigate as NavigateFunction,
          }}
        />
      );
    }
  }

  // This wrapper injects react-router props using hooks and passes them to the class component
  return (props: any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    
    return <WithRouter {...props} params={params} location={location} navigate={navigate} />;
  };
}
