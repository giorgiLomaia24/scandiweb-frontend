import { Component } from "react";
import "./notification.css";

interface NotificationProps {
  message: string;
  visible: boolean;
}

interface NotificationState {
  isVisible: boolean;
}

export class Notification extends Component<NotificationProps, NotificationState> {
  timeoutId: ReturnType<typeof setTimeout> | undefined;

  constructor(props: NotificationProps) {
    super(props);
    this.state = {
      isVisible: props.visible, // Initialize based on prop
    };
  }

  componentDidMount() {
    if (this.state.isVisible) {
      this.autoDismiss();
    }
  }

  componentDidUpdate(prevProps: NotificationProps) {
    if (this.props.visible && !prevProps.visible) {
      this.setState({ isVisible: true }, () => {
        this.autoDismiss();
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  autoDismiss = () => {
    this.timeoutId = setTimeout(() => {
      this.setState({ isVisible: false }); // Hide notification after 5s
    }, 5000);
  };

  render() {
    if (!this.state.isVisible) return null;

    return <div className="notification">{this.props.message}</div>;
  }
}

export default Notification;
