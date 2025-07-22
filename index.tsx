import { definePlugin, PanelSection, PanelSectionRow, ServerAPI, TextField, ButtonItem } from "decky-frontend-lib";
import { VFC, useState } from "react";
import { FaMicrophone } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [status, setStatus] = useState<string>("Ready");

  const handleVoiceChat = async () => {
    setStatus("Processing...");
    const result = await serverAPI.callPluginMethod("voice_interact", { api_key: apiKey });
    if (result.success) {
      setStatus(`Response: ${result.result.response}`);
    } else {
      setStatus(`Error: ${result.result.message}`);
    }
  };

  return (
    <PanelSection title="Grok Voice">
      <PanelSectionRow>
        <TextField
          label="Grok API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={handleVoiceChat}
          disabled={!apiKey}
        >
          <FaMicrophone /> Start Voice Chat
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <div>{status}</div>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className="decky-plugin-title">Grok Voice</div>,
    icon: <FaMicrophone />,
    content: <Content serverAPI={serverApi} />,
  };
});