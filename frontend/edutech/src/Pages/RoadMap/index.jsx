import { useState, useContext, useEffect } from "react";
import "../RoadMap/RoadMap.css";
import { AuthContext } from "../../contexts/AuthConetxts";
import axios from "axios";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import Accordion from "../../components/Accordion/Accordion"; // Assuming this is your custom Accordion component
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useHistory

export default function RoadMap() {
  const [programLanguage, setProgramLanguage] = useState("");
  const [userSavedRoadmaps, setUserSavedRoadmaps] = useState([]);
  const { user } = useContext(AuthContext);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [activeFlowRoadmap, setActiveFlowRoadmap] = useState(null);
  const navigate = useNavigate();

  //  ---Function to get token id from firebase----
  const getFirebaseIdToken = async () => {
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };
  // --- Function to generate and save a new roadmap ---

  async function generateRoadmap(language) {
    if (!language) {
      console.warn(
        "Please enter a programming language to generate a roadmap."
      );
      return;
    }
    const idToken = await getFirebaseIdToken();
    if (!idToken) {
      alert("You must be logged in to generate a roadmap.");
      return;
    }
    try {
      const toastId = toast.loading("roadmap generating");
      const res = await axios.post(
        "http://127.0.0.1:8000/api/roadmap/",
        {
          language: language,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Attach the ID token
            "Content-Type": "application/json",
          },
        }
      );

      const newRoadmap = res.data.roadmap;

      setActiveFlowRoadmap(newRoadmap); // Set it as the active roadmap for ReactFlow immediately
      toast.dismiss(toastId);
      toast.success(`${language} Roadmap Generated`);

      // After generating, refetch all saved roadmaps to include the new one
      // This is important because the backend saves it separately.
      fetchUserRoadmaps();
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast.error("Failed to generate roadmap. Please try again.");
    }
  }

  // --- Function to convert a single roadmap object into ReactFlow nodes/edges ---
  function generateFlowGraph(roadmap) {
    if (!roadmap || !roadmap.milestones || !Array.isArray(roadmap.milestones)) {
      toast.error(
        `Invalid roadmap structure provided to generateFlowGraph:${roadmap}`
      );
      return { nodes: [], edges: [] };
    }

    let newNodes = [];
    let newEdges = [];
    let nodeId = 1;
    let yOffset = 50;

    const createNode = (name, x, y, type) => {
      const colors = {
        milestone: "#fff176", // Light yellow
        topic: "#81d4fa", // Light blue
        subtopic: "#aed581", // Light green
      };

      const backgroundColor = colors[type] || "#ffffff";

      return {
        id: String(nodeId++),
        data: { label: name },
        position: { x, y },
        style: {
          background: backgroundColor,
          padding: 10,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          fontWeight: "bold",
          textAlign: "center",
          minWidth: 180,
          maxWidth: 250,
          whiteSpace: "normal",
          wordWrap: "break-word",
          border: "1px solid #ccc",
        },
      };
    };

    roadmap.milestones.forEach((milestone) => {
      const milestoneNode = createNode(
        `${milestone.title}`,
        300,
        yOffset,
        "milestone"
      );
      newNodes.push(milestoneNode);
      const parentId = milestoneNode.id;

      let topicYOffset = yOffset + 100;

      milestone.topics.forEach((topic) => {
        const topicNode = createNode(topic.name, 600, topicYOffset, "topic");
        newNodes.push(topicNode);
        newEdges.push({
          id: `e${parentId}-${topicNode.id}`,
          source: parentId,
          target: topicNode.id,
          type: "smoothstep",
          animated: true,
        });

        let subtopicOffsetFromTopic = 0;

        topic.children?.forEach((sub) => {
          const subNode = createNode(
            sub.name,
            900,
            topicYOffset + subtopicOffsetFromTopic,
            "subtopic"
          );
          newNodes.push(subNode);
          newEdges.push({
            id: `e${topicNode.id}-${subNode.id}`,
            source: topicNode.id,
            target: subNode.id,
            type: "smoothstep",
            animated: true,
          });
          subtopicOffsetFromTopic += 60;
        });
        topicYOffset += Math.max(subtopicOffsetFromTopic, 60) + 40;
      });

      yOffset = topicYOffset + 80;
    });

    return { nodes: newNodes, edges: newEdges };
  }

  // --- Function to fetch all roadmaps for the user from the database ---
  const fetchUserRoadmaps = async () => {
    const uid = user?.uid;
    if (!uid) {
      console.warn("No user ID available to fetch roadmaps.");
      setUserSavedRoadmaps([]); // Clear previous roadmaps if user logs out
      return;
    }
    const idToken = await getFirebaseIdToken();
    if (!idToken) {
      // If user is not logged in, clear roadmaps and don't fetch
      setUserSavedRoadmaps([]);
      setActiveFlowRoadmap(null);
      return;
    }

    try {
      // Assuming your backend is `api/roadmaps/user/{uid}/`
      const res = await axios.get(
        `http://127.0.0.1:8000/api/roadmaps/${uid}/`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Attach the ID token
          },
        }
      );
      console.log("User database data:", res.data);

      const fetchedRoadmaps = res.data.roadmaps;
      console.log(fetchedRoadmaps);
      if (Array.isArray(fetchedRoadmaps)) {
        setUserSavedRoadmaps(fetchedRoadmaps);
        toast.success("Roadmap Updated Successfully");
        // If no activeFlowRoadmap is set (e.g., on initial load),
        // and there are saved roadmaps, display the first one in ReactFlow.
        if (!activeFlowRoadmap && fetchedRoadmaps.length > 0) {
          setActiveFlowRoadmap(fetchedRoadmaps[0]);
        }
      } else {
        console.warn(
          "Backend did not return an array under 'roadmaps' key:",
          res.data
        );

        setUserSavedRoadmaps([]);
        setActiveFlowRoadmap(null);
      }
    } catch (e) {
      toast.error(`Error fetching user roadmaps:${e.message}`);
      setUserSavedRoadmaps([]);
      setActiveFlowRoadmap(null);
    }
  };

  // --- useEffect to fetch user roadmaps on component mount or user change ---
  useEffect(() => {
    fetchUserRoadmaps();
  }, [user?.uid]);

  // --- useEffect to update ReactFlow nodes/edges when activeFlowRoadmap changes ---
  useEffect(() => {
    if (activeFlowRoadmap) {
      const { nodes: newNodes, edges: newEdges } =
        generateFlowGraph(activeFlowRoadmap);
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [activeFlowRoadmap]);

  // --- Handler for selecting a roadmap from the database accordions to display in ReactFlow ---
  const handleSelectRoadmapForFlow = (roadmap) => {
    setActiveFlowRoadmap(roadmap);
  };
  //  handler to delete roadmap
  const handleDeleteRoadmap = (id) => {
    if (!id) {
      toast.error("no roadmap id is provided to delete");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this roadmap?")) {
      return; // User cancelled
    }
    try {
      axios.delete(`http://127.0.0.1:8000/api/roadmap/delete/${id}/`);
      toast.error("Roadmap deleted");
      fetchUserRoadmaps();
      if (activeFlowRoadmap && activeFlowRoadmap.id === id) {
        setActiveFlowRoadmap(null);
      }
    } catch (error) {
      toast.error("Error deleting roadmap", error);
    }
  };
  //  pushing to video page
  const handlevVideoPage = (topicName) => {
    navigate(`/tutorial/${topicName}`);
    // console.log(topicName);
  };
  return (
    <div className="container-fluid">
      <div className="input-form">
        <input
          type="text"
          className="form-control prompt"
          placeholder="e.g., Python, JavaScript, Data Science"
          value={programLanguage}
          onChange={(e) => setProgramLanguage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              generateRoadmap(programLanguage);
            }
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            generateRoadmap(programLanguage);
          }}
          disabled={!programLanguage.trim()}
        >
          Generate Roadmap
        </button>
      </div>

      {/* Individual Accordions for EACH SAVED ROADMAP from the database */}
      {userSavedRoadmaps.length > 0 && (
        <h3 className="mt-4">Your Saved Roadmaps:</h3>
      )}
      <div className="saved-roadmaps-accordions">
        {userSavedRoadmaps.length > 0 ? (
          userSavedRoadmaps.map((roadmap) => (
            <Accordion
              key={roadmap.id} // Use document_id if available, fallback to uid+language
              title={`${roadmap.title} `}
            >
              <div className="roadmap-details">
                <h4>Milestones:</h4>
                <ul>
                  {roadmap.milestones &&
                    roadmap.milestones.map((milestone, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlevVideoPage(milestone.title);
                          }}
                        >
                          <strong>{milestone.title}</strong>
                        </a>
                        <ul>
                          {milestone.topics &&
                            milestone.topics.map((topic, topicIndex) => (
                              <li key={topicIndex}>
                                {topic.name}
                                {topic.children &&
                                  topic.children.length > 0 && (
                                    <ul>
                                      {topic.children.map(
                                        (subtopic, subIndex) => (
                                          <li key={subIndex}>
                                            {subtopic.name}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                </ul>
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDeleteRoadmap(roadmap.id)} // Pass the internal 'id'
                  style={{ marginLeft: "10px" }} // Add some spacing
                >
                  Delete Roadmap
                </button>
                <button
                  className="btn btn-info btn-sm mt-2"
                  onClick={() => handleSelectRoadmapForFlow(roadmap)}
                >
                  View in Flow Graph
                </button>
              </div>
            </Accordion>
          ))
        ) : (
          <p className="no-roadmap-message mt-3">
            No saved roadmaps yet. Generate one to get started!
          </p>
        )}
      </div>

      {/* Unified ReactFlow display for the currently selected roadmap */}
      <Accordion title={"Roadmap Flow Visualization"}>
        <div id="react-flow-display-section" className="roadmap-display">
          {nodes.length > 0 ? (
            <div className="roadmap-component">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                panOnScroll={true}
                zoomOnScroll={true}
                panOnDrag={true}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
              />
            </div>
          ) : (
            <p className="no-roadmap-message">
              Select a roadmap from above or generate a new one to see its flow
              graph.
            </p>
          )}
        </div>
      </Accordion>
    </div>
  );
}
